import fp from "fastify-plugin";
import app from "../server.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { type userInfos } from "../models/user.model.js";

export const jwtPlugin = fp(async function (fastify, opts) {
  app.decorate(
    "jwtAuth",
    async function (req: FastifyRequest, res: FastifyReply): Promise<any> {
      try {
        const accessToken = req.cookies.accessToken;
        await app.jwt.jwt1.verify(accessToken);
      } catch (err) {
        res.code(401).send({ error: "JWT_EXPIRED" });
      }
    }
  );
});
