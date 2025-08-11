import app from "../server.js";
import { type User, type LoginBody  } from "../models/user.js"
import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";

export const loginUser = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    try {
        let user = {} as User | undefined;
        let userPass = "" as string;
        const { username, email, password } = req.body;


        //check username
        if (username) {
            user = app.db
                .prepare('SELECT * from players WHERE username = ?')
                .get(username) as User | undefined;

            userPass = app.db
                .prepare('SELECT password from players WHERE username = ?')
                .get(username);
        }
        //check email
        if (email) {
            user = app.db
                .prepare('SELECT * from players WHERE email = ?')
                .get(email) as User | undefined;

            userPass = app.db
                .prepare('SELECT password from players WHERE email = ?')
                .get(email);
        }

        console.log(userPass.password);
        const isMatch = bcrypt.compareSync(password, userPass.password);

        if (!user || !isMatch) {
            return res.status(500).send({ error: "Wrong credentials"});
        }

        //verify JWT token
        const token = app.jwt.sign({ email, username });
        
        return res.status(200).send({ token: token, message: "Logged in" });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err });
    }
}
