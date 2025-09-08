import type { FastifyReply, FastifyRequest } from "fastify";
import type { Payload } from "../models/chat.js";
import app from "../server.js";

export const fetchUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    // const { username } = req.params;
    const accessToken = req.cookies.accessToken;

    const infos = app.jwt.jwt1.decode(accessToken!) as Payload | null;
    res.status(200).send({ infos: infos });
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

    if (!username || username == payload?.username) {
      return res.status(200).send({ infos: payload, profileType: "me" });
    }

    if (username) {
      const user = app.db
        .prepare("SELECT * FROM players WHERE username = ?")
        .get(username);
      if (!user) return res.status(404).send({ message: "User not found" });
      else {
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
