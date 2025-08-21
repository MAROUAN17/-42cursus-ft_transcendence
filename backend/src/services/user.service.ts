import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";

export const fetchUser = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const jwtToken = req.cookies.refreshToken;
        const infos = app.jwt.jwt1.decode(jwtToken!) as string | null;
        res.status(200).send({ infos: infos });
    } catch (error) {
        res.status(401).send({error: "Unauthorized"});
    }
}