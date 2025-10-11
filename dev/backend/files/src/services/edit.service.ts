import type { FastifyReply, FastifyRequest } from "fastify";
import type { MultipartFile } from "@fastify/multipart";
import app from "../server.js";
import type { LoginBody, UserInfos } from "../models/user.model.js";
import { pump } from "../server.js";
import fs, { access } from "fs";
import path from "path";

export const editUserInfos = async (req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) => {
  try {
    let user = {} as UserInfos | undefined;

    let data, avatar: MultipartFile;
    for await (const part of req.parts()) {
      if ((part as any).fieldname === "data") {
        data = JSON.parse((part as any).value);
      } else if ((part as MultipartFile).fieldname === "avatar") {
        avatar = part as MultipartFile;
      }
    }

    let { id, username, email } = data;

    if (!id) return;

    const usernamePattern = new RegExp("^[a-zA-Z0-9]+$");
    if (username.length < 3 || username.length > 16) {
      res.status(401).send({ error: "Username must be between 3 and 16 characters" });
      return;
    } else if (!usernamePattern.test(username)) {
      res.status(401).send({ error: "Username must be valid" });
      return;
    }

    email = email.toLowerCase();
    username = username.toLowerCase();

    user = app.db.prepare("SELECT * FROM players WHERE id = ?").get(id);
    if (!user) return res.status(404).send({ error: "USER NOT FOUND" });
    const oldAvatar = user?.avatar;

    //file upload
    if (avatar!.mimetype != "image/png" && avatar!.mimetype != "image/jpg" && avatar!.mimetype != "image/jpeg") {
      return res.status(401).send({ error: "File format not supported!" });
    }

    const uploadDir = path.resolve("/app/uploads/");

    const fileName = Date.now().toString() + "." + avatar!.mimetype.split("/")[1];
    const filePath = path.join(uploadDir, fileName);

    await pump(avatar!.file, fs.createWriteStream(filePath));

    fs.unlink('/app/uploads/' + oldAvatar, (err) => {
      if (err) {
        console.log(err);
      }
    });

    app.db.prepare("UPDATE players SET avatar = ? WHERE id = ?").run(fileName, id);

    //check if username user exists
    user = app.db.prepare("SELECT * from players WHERE username = ? AND id <> ?").get(username, id) as UserInfos | undefined;
    if (user) return res.status(401).send({ error: "Username already exists" });

    //check if user email already exists
    user = app.db.prepare("SELECT * from players WHERE email = ? AND id <> ?").get(email, id) as UserInfos | undefined;
    if (user) return res.status(401).send({ error: "Email already exist!" });

    const updatedUser = app.db.prepare("UPDATE players SET email = ?, username = ? WHERE id = ?").run(email, username, id);

    if (updatedUser.changes == 0) return res.status(401).send({ error: "NO UPDATES" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

export const setAvatar = async (req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) => {
  try {
    const { id, avatar } = req.body;

    if (!id || !avatar) {
      return res.status(401).send({ error: "Id and avatar must be provided" });
    }

    const user = app.db.prepare("SELECT * FROM players WHERE id = ?").get(id) as UserInfos | null;
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    app.db.prepare("UPDATE players SET avatar = ?, first_login = ? WHERE id = ?").run(avatar, 0, id);

    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
