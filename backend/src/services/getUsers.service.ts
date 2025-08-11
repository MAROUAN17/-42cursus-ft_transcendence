import type { FastifyReply, FastifyRequest } from "fastify";
import type {User} from "../models/user.js"
import app from "../server.js"

export const getUsers = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const users: User[] = app.db
            .prepare("SELECT * FROM players")
            .all() as User[];

        res.status(200).send({ data: users });
    } catch (err) {
        res.status(500).send({ error: err });
    }
};