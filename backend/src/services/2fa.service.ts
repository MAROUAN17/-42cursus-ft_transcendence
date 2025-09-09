import type { FastifyRequest, FastifyReply } from "fastify";
import {
  type User,
  type LoginBody,
  type userInfos,
} from "../models/user.model.js";
import app from "../server.js";
import qrcode from "qrcode";
import { authenticator } from "otplib";

export const setup2FA = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) => {
  const { email } = req.body;

  const secret = authenticator.generateSecret();
  const otpath = authenticator.keyuri(email!, "OTP APP", secret);

  const qrCode = await qrcode.toDataURL(otpath);

  return [qrCode, secret];
};

export const verifySetup2FA = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) => {
  try {
    const { token, secret } = req.body;

    const isValid = authenticator.verify({ token: token, secret: secret });

    if (isValid) {
      return res
        .status(200)
        .send({ message: "Valid OTP code And user registered" });
    }

    return res.status(401).send({ error: "Invalid otp code" });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export const verify2FAToken = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) => {
  try {
    let { token, email } = req.body;

    let user = {} as User | null;

    email = email.toLowerCase();
    //find user
    if (email.includes("@")) {
      user = app.db
        .prepare("SELECT * FROM PLAYERS WHERE email = ?")
        .get(email) as User;
    } else {
      user = app.db
        .prepare("SELECT * FROM PLAYERS WHERE username = ?")
        .get(email) as User;
    }

    const secret = user.secret_otp;
    const isValid = authenticator.verify({ token: token, secret: secret });

    if (isValid) {
      const updatedUser = app.db
        .prepare("UPDATE players SET twoFA_verify = ? WHERE id = ?")
        .run(1, user.id);

      if (updatedUser.changes == 0) return;

      //sign new JWT tokens
      const accessToken = app.jwt.jwt1.sign(
        { id: user.id, email: user.email, username: user.username },
        { expiresIn: "900s" }
      );
      const refreshToken = app.jwt.jwt2.sign(
        { id: user.id, email: user.email, username: user.username },
        { expiresIn: "1d" }
      );

      //clear login token
      res.clearCookie("loginToken", {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      });

      //set JWT token as cookie
      res.setCookie("accessToken", accessToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 900,
      });

      return res
        .setCookie("refreshToken", refreshToken, {
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "lax",
          maxAge: 86400,
        })
        .status(200)
        .send({ message: "Valid OTP code" });
    }
    return res.status(401).send({ error: "INVALID_OTP" });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

