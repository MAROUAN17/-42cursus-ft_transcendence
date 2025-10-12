import type { FastifyRequest, FastifyReply } from "fastify";
import { type LoginBody, type UserInfos } from "../models/user.model.js";
import app from "../server.js";
import qrcode from "qrcode";
import { authenticator } from "otplib";
import type { SerializeOptions } from "@fastify/cookie";
import type { Payload } from "../models/chat.js";

export const setup2FA = async (req: FastifyRequest, res: FastifyReply) => {
  const token = req.cookies.accessToken;
  const payload = app.jwt.jwt1.verify(token) as Payload;

  const secret = authenticator.generateSecret();
  const otpath = authenticator.keyuri(payload?.email!, "OTP APP", secret);

  const qrCode = await qrcode.toDataURL(otpath);

  return [qrCode, secret];
};

export const deleteSetup2FA = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(token) as Payload;

    if (!payload.id) return res.status(404).send({ error: "User not found" });

    app.db.prepare("UPDATE players SET twoFA_verify = ?, secret_otp = ? WHERE id = ?").run(0, null, payload?.id);

    res.status(200).send({ message: "2fa deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error while 2fa deletion" });
  }
};

export const verifySetup2FA = async (req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) => {
  try {
    const { token, secret } = req.body;

    const accessToken = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(accessToken) as Payload;

    const isValid = authenticator.verify({ token: token, secret: secret });

    if (isValid) {
      app.db.prepare("UPDATE players SET twoFA_verify = ?, secret_otp = ? WHERE id = ?").run(1, secret, payload?.id);
      return res.status(200).send({ message: "Valid OTP code And user registered" });
    }

    return res.status(401).send({ error: "Invalid otp code" });
  } catch (err) {
    res.status(500).send({ error: 'Error occurred while verifying 2FA setup' });
  }
};

export const verify2FAToken = async (req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) => {
  try {
    let { token, email, rememberMe } = req.body;
    let user = {} as UserInfos | null;

    email = email.toLowerCase();
    //find user
    if (email.includes("@")) {
      user = app.db.prepare("SELECT * FROM PLAYERS WHERE email = ?").get(email) as UserInfos;
    } else {
      user = app.db.prepare("SELECT * FROM PLAYERS WHERE username = ?").get(email) as UserInfos;
    }

    if (!user) return res.status(404).send({ error: "User not found" });

    const secret = user?.secret_otp;
    const isValid = authenticator.verify({ token: token, secret: secret });

    if (isValid) {
      const updatedUser = app.db.prepare("UPDATE players SET twoFA_verify = ? WHERE id = ?").run(1, user.id);

      if (updatedUser.changes == 0) return;

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

      return res.status(200).send({ message: "Valid OTP code" });
    }
    return res.status(401).send({ error: "INVALID_OTP" });
  } catch (error) {
    res.status(500).send({ error: 'Error occurred while verifying 2FA OTP' });
  }
};
