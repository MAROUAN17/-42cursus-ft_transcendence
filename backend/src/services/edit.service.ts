import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import type { User, LoginBody } from "../models/user.model.js";

export const editUserInfos = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) => {
  try {
    let user = {} as User | undefined;
    let { id, username, email } = req.body;

    if (!id) return;

    const usernamePattern = new RegExp("^[a-zA-Z0-9]+$");
    if (username.length < 3 || username.length > 16) {
      res
        .status(401)
        .send({ error: "Username must be between 3 and 16 characters" });
      return;
    } else if (!usernamePattern.test(username)) {
      res.status(401).send({ error: "Username must be valid" });
      return;
    }

    email = email.toLowerCase();
    username = username.toLowerCase();

    user = app.db.prepare("SELECT * FROM players WHERE id = ?").get(id);
    if (!user) return res.status(404).send({ error: "USER NOT FOUND" });

    //check if username user exists
    user = app.db
      .prepare("SELECT * from players WHERE username = ? AND id <> ?")
      .get(username, id) as User | undefined;
    if (user) return res.status(401).send({ error: "Username already exists" });

    //check if user email already exists
    user = app.db
      .prepare("SELECT * from players WHERE email = ? AND id <> ?")
      .get(email, id) as User | undefined;
    if (user) return res.status(401).send({ error: "Email already exist!" });

    const updatedUser = app.db
      .prepare("UPDATE players SET email = ?, username = ? WHERE id = ?")
      .run(email, username, id);

    if (updatedUser.changes == 0)
      return res.status(401).send({ error: "NO UPDATES" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const setAvatar = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) => {
  try {
    const { id, avatar } = req.body;

    if (!id || !avatar) {
      return res.status(401).send({ error: "Id and avatar must be provided" });
    }

    const user = app.db
      .prepare("SELECT * FROM players WHERE id = ?")
      .get(id) as User | null;
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    app.db
      .prepare("UPDATE players SET avatar = ?, first_login = ? WHERE id = ?")
      .run(avatar, 0, id);

    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
