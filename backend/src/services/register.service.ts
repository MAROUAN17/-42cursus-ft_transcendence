import app from "../server.js";
import { type User, type LoginBody  } from "../models/user.js"
import type { FastifyReply, FastifyRequest } from "fastify";


export const registerUser = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    const { username, email, password } = req.body;

    //check if user exists
    const user = app.db
            .prepare('SELECT * from players WHERE username = ? AND email = ?')
            .get(username, email) as User | undefined;
    if (user) {
        return res.status(500).send({ error: "User already exist!" });
    }

    //register if not exists
    const info = app.db
        .prepare('INSERT INTO players(username, email, password) VALUES (?, ?, ?)')
        .run(username, email, password);

    return res.status(200).send({ message: info.changes });
}
