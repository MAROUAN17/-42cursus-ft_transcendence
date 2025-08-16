import app from "../server.js";
import { type User, type LoginBody, type userPass  } from "../models/user.js"
import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";

export const loginUser = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    try {
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
            return res.status(401).send({ error: "Wrong credentials" });
        }

        const isMatch = await bcrypt.compare(password, user?.password);

        if (!isMatch) {
            return res.status(401).send({ error: "Wrong credentials" });
        }

        //verify JWT token
        const token = app.jwt.sign({ email:user.email, username:user.username }, { expiresIn: '1d' });
    
        //set JWT token as cookie
        return res.setCookie('token', token, {
            path: '/',
            secure: false,
            httpOnly: true, 
            sameSite: 'lax'
        }).status(200).send({ message: "Logged in", data: {username: user?.username, email: user?.email } })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err });
    }
}
