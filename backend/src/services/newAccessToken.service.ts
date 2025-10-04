import type { FastifyRequest, FastifyReply } from "fastify";
import {
  type UserInfos
} from "../models/user.model.js";
import app from "../server.js";

export const requestNewToken = async (
  req: FastifyRequest,
  res: FastifyReply
): Promise<any> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await app.jwt.jwt2.verify(refreshToken);

    const infos = (await app.jwt.jwt2.verify(refreshToken)) as
      | UserInfos
      | undefined;

    const newAccessToken = app.jwt.jwt1.sign(
      {
        id: infos?.id,
        email: infos?.email,
        username: infos?.username,
        otp_verified: false,
      },
      { expiresIn: "10s" }
    );

    res.clearCookie("accessToken", {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });

    res.setCookie("accessToken", newAccessToken, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 10,
    });
  } catch (error) {
    res.status(401).send({ error: "REFRESH_EXPIRED" });
  }
};
