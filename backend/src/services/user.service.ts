import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";

export const fetchUser = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const accessToken = req.cookies.accessToken;
        const infos = app.jwt.jwt1.decode(accessToken!) as string | null;
        res.status(200).send({ infos: infos });
    } catch (error) {
        res.status(401).send({ error: "JWT_EXPIRED" });
    }
}