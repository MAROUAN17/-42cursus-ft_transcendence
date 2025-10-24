import type { FastifyRequest, FastifyReply } from "fastify";
import { type UserInfos } from "../models/user.model.js";
import app from "../server.js";
import type { Payload } from "../models/chat.js";
import type { SerializeOptions } from "@fastify/cookie";

export const requestNewToken = async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await app.jwt.jwt2.verify(refreshToken);

    const infos = (await app.jwt.jwt2.verify(refreshToken)) as Payload | undefined;

    const accessOptions = {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    } as SerializeOptions;

    if (infos?.rememberMe) accessOptions.maxAge = 900;

    const newAccessToken = app.jwt.jwt1.sign(
      {
        id: infos?.id,
        email: infos?.email,
        username: infos?.username,
        rememberMe: infos?.rememberMe,
      },
      { expiresIn: "900s" }
    );

    res.clearCookie("accessToken", {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });

    res.setCookie("accessToken", newAccessToken, accessOptions);
  } catch (error) {
    res.status(401).send({ error: "REFRESH_EXPIRED" });
  }
};
