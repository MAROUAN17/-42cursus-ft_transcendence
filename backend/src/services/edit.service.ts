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

    console.log(`username -> ${username}`);
    console.log(`email -> ${email}`);

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
