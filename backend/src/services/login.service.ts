import {
  type User,
  type LoginBody,
  type userPass,
} from "../models/user.model.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import app from "../server.js";

export const loginUser = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) => {
  try {
    let { email, password, rememberMe } = req.body;
    let user = {} as User | undefined;

    email = email.toLowerCase();

    //fetch all users
    const stmt = app.db.prepare("SELECT * FROM players");
    const rows = stmt.all();
    console.log(rows);
    //--------------


    //fetch all user
    const stmt2 = app.db.prepare("SELECT * FROM players where id = ?");
    const row = stmt2.get(1);
    console.log(row);
    //--------------

    //check username
    if (email.includes("@")) {
      user = app.db
        .prepare("SELECT * from players WHERE email = ?")
        .get(email) as User | undefined;
    } else {
      user = app.db
        .prepare("SELECT * from players WHERE username = ?")
        .get(email) as User | undefined;
    }

    console.log("email -> ", email);
    console.log("user -> ", user);

    if (!user) {
      return res.status(401).send({ error: "Incorrect username or password." });
    }

    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return res.status(401).send({ error: "Incorrect username or password." });
    }

    const updatedUser = app.db
      .prepare("UPDATE players SET logged_in = ? WHERE id = ?")
      .run(1, user.id);

    if (updatedUser.changes == 0) return;

    const loginToken = app.jwt.jwt0.sign(
      { id: user.id, email: user.email, username: user.username },
      { expiresIn: "60s" }
    );

    res
      .setCookie("loginToken", loginToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60,
      })
      .send({ message: "Logged in" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};
