import app from "../server.js";
import { type UserInfos, type LoginBody } from "../models/user.model.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";

export const registerUser = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) => {
  try {
    let user = {} as UserInfos | undefined;
    let { username, email, password } = req.body;

    email = email.toLowerCase();
    //check if username user exists
    user = app.db
      .prepare("SELECT * from players WHERE username = ?")
      .get(username) as UserInfos | undefined;
    if (user) return res.status(401).send({ error: "Username already exists" });

    //check if user email already exists
    user = app.db
      .prepare("SELECT * from players WHERE email = ?")
      .get(email) as UserInfos | undefined;
    if (user) {
      return res.status(401).send({ error: "Email already exist!" });
    }

    //hashing the password
    const hash: string = await bcrypt.hash(password, 10);

    app.db
      .prepare(
        "INSERT INTO players(username, email, password) VALUES (?, ?, ?)"
      )
        .run(username, email, hash);

    res.status(200).send({ message: "Registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(401).send({ error });
  }
};

export const verifyRegisterUser = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) => {
  try {
    let user = {} as UserInfos | undefined;
    let { username, email, password, secret } = req.body;

    //regex check
    const usernamePattern = new RegExp("^[a-zA-Z0-9_-]+$");
    const passwordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$");

    if (!usernamePattern.test(username)) {
      return res
        .status(401)
        .send({ error: "Username not valid, try another one!" });
    }

    if (username.length < 3 || username.length > 16) {
      return res
        .status(401)
        .send({ error: "Username must be between 3 and 16 characters" });
    }

    if (password.length < 8 || password.length > 30) {
      return res.status(401).send({
        error:
          "Password should be at least 8 characters including a lowercaser letter and a number",
      });
    }

    if (!passwordPattern.test(password)) {
      return res
        .status(401)
        .send({ error: "Password not valid, try another one!" });
    }

    email = email.toLowerCase();

    //check if username user exists
    user = app.db
      .prepare("SELECT * from players WHERE username = ?")
      .get(username) as UserInfos | undefined;
    if (user) return res.status(401).send({ error: "Username already exists" });

    //check if user email already exists
    user = app.db
      .prepare("SELECT * from players WHERE email = ?")
      .get(email) as UserInfos | undefined;
    if (user) {
      return res.status(401).send({ error: "Email already exist!" });
    }

    res.status(200).send({ message: "Credentials correct!" });
  } catch (error) {
    res.status(401).send({ error });
  }
};
