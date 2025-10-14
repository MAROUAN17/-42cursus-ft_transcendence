import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import type { LoginBody, UserInfos } from "../models/user.model.js";
import type { Payload } from "../models/chat.js";

export const editUserInfos = async (req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) => {
  try {
    let user = {} as UserInfos | undefined;
    const accessToken = req.cookies.accessToken;
    const payload = app.jwt.jwt1.decode(accessToken) as Payload;

    let { username, email } = req.body;

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

    user = app.db.prepare("SELECT * FROM players WHERE id = ?").get(payload?.id);
    if (!user) return res.status(404).send({ error: "USER NOT FOUND" });

    //check if username user exists
    user = app.db.prepare("SELECT * from players WHERE username = ? AND id <> ?").get(username, payload?.id) as UserInfos | undefined;
    if (user) return res.status(401).send({ error: "Username already exist" });

    //check if user email already exists
    user = app.db.prepare("SELECT * from players WHERE email = ? AND id <> ?").get(email, payload?.id) as UserInfos | undefined;
    if (user) return res.status(401).send({ error: "Email already exist" });

    const updatedUser = app.db.prepare("UPDATE players SET email = ?, username = ? WHERE id = ?").run(email, username, payload?.id);

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
