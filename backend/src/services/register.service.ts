import app from "../server.js";
import { type User, type LoginBody  } from "../models/user.js"
import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";


export const registerUser = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    const { username, email, password } = req.body;

    //check if user exists
    const user = app.db
            .prepare('SELECT * from players WHERE username = ? AND email = ?')
            .get(username, email) as User | undefined;

    if (user) {
        return res.status(500).send({ error: "User already exist!" });
    }

    //hashing the password
    const hash = bcrypt.hashSync(password, 10);
    if (!hash)
        res.status(500).send({ error: "Password hashing failed" });

    //register if not exists
    const info = app.db
        .prepare('INSERT INTO players(username, email, password) VALUES (?, ?, ?)')
        .run(username, email, hash);

    return res.status(200).send({ message: info.changes });
}
