import app from "../server.js";
import { type User, type LoginBody  } from "../models/user.js"
import type { FastifyReply, FastifyRequest } from "fastify";

export const loginUser = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    let user = {} as User | undefined;
    const { username, email, password } = req.body;


    //check username
    if (username) {
        user = app.db
            .prepare('SELECT * from players WHERE username = ?')
            .get(username) as User | undefined;
    }
    //check email
    if (email) {
        user = app.db
            .prepare('SELECT * from players WHERE email = ?')
            .get(email) as User | undefined;
    }

    if (!user) {
        res.status(404).send({ error: "User not found. "});
    }

    //verify JWT token
    

    return res.status(200).send({ message: user});
}
