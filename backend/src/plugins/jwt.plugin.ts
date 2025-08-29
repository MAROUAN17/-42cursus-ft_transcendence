import fp from "fastify-plugin";
import app from "../server.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { type userInfos } from "../models/user.model.js";

export const jwtPlugin = fp(async function (fastify, opts) {
  app.decorate("jwtAuth", async function (req: FastifyRequest, res: FastifyReply): Promise<any> {
    try {
      const accessToken = req.cookies.accessToken;
      await app.jwt.jwt1.verify(accessToken);
    } catch (err) {
      try {
        const refreshToken = req.cookies.refreshToken;
        const infos = (await app.jwt.jwt2.verify(refreshToken)) as userInfos | undefined;
        const newAccessToken = app.jwt.jwt1.sign(
          { id: infos?.id, email: infos?.email, username: infos?.username, otp_verified: false },
          { expiresIn: "1d" }
        );
        res.setCookie("accessToken", newAccessToken, {
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "lax",
          maxAge: 5000000,
        });
      } catch (err: any) {
        res.code(401).send({ error: "Unauthorized" });
      }
    }
  });
});
