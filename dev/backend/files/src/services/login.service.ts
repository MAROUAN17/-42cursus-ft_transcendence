import { type UserInfos, type LoginBody } from "../models/user.model.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import app from "../server.js";
import type { SerializeOptions } from "@fastify/cookie";

export const loginUser = async (req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) => {
  try {
    let { email, password, rememberMe } = req.body;
    let user = {} as UserInfos | undefined;

    email = email.toLowerCase();
    //check username
    if (email.includes("@")) {
      user = app.db.prepare("SELECT * from players WHERE email = ?").get(email) as UserInfos | undefined;
    } else {
      user = app.db.prepare("SELECT * from players WHERE username = ?").get(email) as UserInfos | undefined;
    }

    if (!user) {
      return res.status(401).send({ error: "Incorrect username or password." });
    }

    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return res.status(401).send({ error: "Incorrect username or password." });
    }

    const updatedUser = app.db.prepare("UPDATE players SET logged_in = ? WHERE id = ?").run(1, user.id);

    if (updatedUser.changes == 0) return;

    const twoFA_activated: boolean = user?.secret_otp ? true : false;

    if (twoFA_activated) {
      const loginToken = app.jwt.jwt0.sign({ id: user.id, email: user.email, username: user.username }, { expiresIn: "60s" });
      res
        .setCookie("loginToken", loginToken, {
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60,
        })
        .send({ twoFA: twoFA_activated, message: "Logged in" });
    } else {
      const refreshOptions = {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      } as SerializeOptions;
      const accessOptions = {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      } as SerializeOptions;

      if (rememberMe) {
        refreshOptions.maxAge = 86400;
        accessOptions.maxAge = 900;
      }

      //sign new JWT tokens
      const accessToken = app.jwt.jwt1.sign({ id: user.id, email: user.email, username: user.username }, { expiresIn: "900s" });
      const refreshToken = app.jwt.jwt2.sign({ id: user.id, email: user.email, username: user.username }, { expiresIn: "1d" });

      //clear login token
      res.clearCookie("loginToken", {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      });

      //set JWT token as cookie
      res.setCookie("accessToken", accessToken, accessOptions);
      res.setCookie("refreshToken", refreshToken, refreshOptions);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};
