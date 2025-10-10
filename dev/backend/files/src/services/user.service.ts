import type { FastifyReply, FastifyRequest } from "fastify";
import type { Payload } from "../models/chat.js";
import app from "../server.js";
import type { LoginBody } from "../models/user.model.js";
import type { User } from "../models/user.model.js";
import { pump } from "../server.js";
import fs, { access } from "fs";

export const fetchUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const accessToken = req.cookies.accessToken;

    const infos = app.jwt.jwt1.decode(accessToken!) as Payload | null;

    const user = app.db
      .prepare("SELECT * FROM players WHERE id = ?")
      .get(infos?.id);
    if (!user) return;

    if (!user.avatar) {
      app.db
        .prepare("UPDATE players SET avatar = ? WHERE id = ?")
        .run("/profile1.jpg", infos?.id);
    }

    res.status(200).send({ infos: user });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const fetchProfileUser = async (
  req: FastifyRequest<{ Params: { username?: string } }>,
  res: FastifyReply
) => {
  try {
    const { username } = req.params;

    const accessToken = req.cookies.accessToken;
    const payload = app.jwt.jwt1.decode(accessToken!) as Payload | null;

    const user = app.db
      .prepare("SELECT * FROM players WHERE id = ?")
      .get(payload?.id) as User | undefined;
    if (!user) return res.status(404).send({ error: "USER NOT FOUND" });
    
    if (!username || username == user.username) {
      return res.status(200).send({ infos: user, profileType: "me", twoFAVerify: user?.twoFA_verify });
    }

    if (username) {
      const user = app.db
        .prepare("SELECT * FROM players WHERE username = ?")
        .get(username);
      if (!user) return res.status(404).send({ message: "User not found" });

      //check if the requested user blocked the current user
      const checkBlocked = app.db
        .prepare(
          "SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?"
        )
        .get(payload?.id, user.id.toString());

      if (checkBlocked) {
        return res.status(200).send({
          message: "User1 Blocked User2",
          infos: user,
          profileType: "other",
          friend: false,
          friendNotif: false,
        });
      }

      //check if the requested user is a friend
      const checkFriend = app.db
        .prepare(
          "SELECT key FROM json_each((SELECT friends FROM players WHERE id = ?)) WHERE value = ?"
        )
        .get(payload?.id, user.id.toString());

      if (checkFriend)
        return res.status(200).send({
          infos: user,
          profileType: "other",
          friend: true,
          friendNotif: false,
        });

      //check if friend request already sent
      const checkNotif = app.db
        .prepare(
          "SELECT * from notifications WHERE sender_id = ? AND recipient_id = ? AND type = ?"
        )
        .get(payload?.id, user.id.toString(), "friendReq");

      if (checkNotif)
        return res.status(200).send({
          infos: user,
          profileType: "other",
          friend: false,
          friendNotif: true,
        });

      res.status(200).send({
        infos: user,
        profileType: "other",
        friend: false,
        friendNotif: false,
      });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const checkBlock = async (
  req: FastifyRequest<{ Params: { username?: string } }>,
  res: FastifyReply
) => {
  try {
    const { username } = req.params;

    const accessToken = req.cookies.accessToken;
    const payload = app.jwt.jwt1.decode(accessToken!) as Payload | null;

    if (username) {
      const user = app.db
        .prepare("SELECT * FROM players WHERE username = ?")
        .get(username);

      if (user) {
        const checkBlocked = app.db
          .prepare(
            "SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?"
          )
          .get(user.id, payload?.id.toString());

        if (checkBlocked)
          return res.status(404).send({ error: "User2 Blocked User1" });

        res.status(200).send({ message: "you can see user profile" });
      }
    }
    return res.status(200);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const checkUserLoginPageStatus = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (accessToken || refreshToken) {
      return res.status(401).send({ error: "LOGGED_IN" });
    }
    res.status(200).send({ message: "NOT LOGGED_IN" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const checkUserLoginStatus = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      return res.status(200).send({ message: "LOGGED_IN" });
    }

    res
      .clearCookie("accessToken", {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      })
      .clearCookie("refreshToken", {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      });

    res.status(401).send({ error: "NOT LOGGED_IN" });
  } catch (error) {
    res.status(500).send({ error: error.data.error });
  }
};

export const checkUser2faStatus = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const loginToken = req.cookies.loginToken;

    if (!loginToken) {
      return res.status(401).send({ error: "UNAUTHORIZED" });
    }

    res.status(200).send({ message: "AUTHORIZED" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

import path from "path";
export const uploadUserInfos = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const payload = app.jwt.jwt1.decode(accessToken) as Payload;

    const fileData = await req.file();

    if (
      fileData?.mimetype != "image/png" &&
      fileData?.mimetype != "image/jpg" &&
      fileData?.mimetype != "image/jpeg"
    ) {
      return res.status(401).send({ error: "File format not supported!" });
    }


    
    const uploadDir = path.resolve(
      "/goinfre/maglagal/ft_transcendence/frontend/public/"
    );

    const filePath = path.join(uploadDir, fileData!.filename);

    await pump(fileData!.file, fs.createWriteStream(filePath));

    const user = app.db
      .prepare("SELECT * FROM players WHERE id = ?")
      .get(payload.id) as User | null;
    if (!user) return res.status(404).send({ error: "USER NOT FOUND" });

    app.db
      .prepare("UPDATE players SET avatar = ? WHERE id = ?")
      .run(fileData?.filename, payload.id);

    return res
      .status(200)
      .send({ message: "files uploaded", file: fileData?.filename });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getUserInfo = async ( req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  try {
    const { id } = req.params;

    const user = app.db
      .prepare("SELECT * FROM players WHERE id = ?")
      .get(id) as User | null;
    if (!user) return res.status(404).send({ error: "USER NOT FOUND" });

    res.status(200).send({ infos: user });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
