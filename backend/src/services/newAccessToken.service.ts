import type { FastifyRequest, FastifyReply } from "fastify";
import { type User, type LoginBody, type userInfos } from "../models/user.model.js"
import app from "../server.js"


export const requestNewToken = async (req: FastifyRequest, res: FastifyReply): Promise<any> =>
{
    try {
      const refreshToken = req.cookies.refreshToken;
      await app.jwt.jwt2.verify(refreshToken);

      const infos = (await app.jwt.jwt2.verify(refreshToken)) as userInfos | undefined;
      const newAccessToken = app.jwt.jwt1.sign(
        { id: infos?.id, email: infos?.email, username: infos?.username, otp_verified: false },
        { expiresIn: "900s" }
      );
      res.status(200).setCookie("accessToken", newAccessToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 900,
      }).send({ token: newAccessToken });    
    } catch (error) {
      res.status(401).send({ error: "REFRESH_EXPIRED" });
    }
}