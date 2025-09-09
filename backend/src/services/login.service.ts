import { type User, type LoginBody, type userPass  } from "../models/user.model.js"
import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import app from "../server.js"

export const loginUser = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    try {
        let user = {} as User | undefined;
        let { email, password } = req.body;
    
        
        //check username
        if (email.includes("@")) {
            email = email.toLowerCase();
            user = app.db
            .prepare('SELECT * from players WHERE email = ?')
            .get(email) as User | undefined;
        } else {
            user = app.db
            .prepare('SELECT * from players WHERE username = ?')
            .get(email) as User | undefined;
        }

        if (!user) {
            return res.status(401).send({ error: "Incorrect username or password." });
        }

        const isMatch = await bcrypt.compare(password, user?.password);

        if (!isMatch) {
            return res.status(401).send({ error: "Incorrect username or password." });
        }

        // const loginToken = app.jwt.jwt0.sign({ email: user.email }, { expiresIn: '30s' });

        const updatedUser = app.db
            .prepare('UPDATE players SET logged_in = ? WHERE id = ?')
            .run(1, user.id);

        if (updatedUser.changes == 0) return ;
    
        res.status(200).send({ message: "Logged in", data: { username: user?.username, email: user?.email } })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err });
    }
}
