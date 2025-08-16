import app from "../server.js";
import { type User, type LoginBody  } from "../models/user.model.js"
import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";


export const registerUser = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    try {
        let user = {} as User | undefined;
        let { username, email, password } = req.body;

        email = email.toLowerCase();

        //check if username user exists
        user = app.db
                .prepare('SELECT * from players WHERE username = ?')
                .get(username) as User | undefined;
        if (user)
            return res.status(401).send({ error: "Username already exists" });

        //check if user email already exists
        user = app.db
            .prepare('SELECT * from players WHERE email = ?')
            .get(email) as User | undefined;
        if (user) {
            return res.status(401).send({ error: "Email already exist!" });
        }

        //hashing the password
        const hash: string = await bcrypt.hash(password, 10);

        app.db
            .prepare('INSERT INTO players(username, email, password) VALUES (?, ?, ?)')
            .run(username, email, hash);

        res.status(200).send({ message: "Registered successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(401).send({ error });
    }
}
