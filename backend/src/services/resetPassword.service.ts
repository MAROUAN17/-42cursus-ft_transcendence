import type { FastifyRequest, FastifyReply } from "fastify"
import type { LoginBody } from "../models/user.model.js"
import app from "../server.js"
import bcrypt from "bcrypt";


export const checkResetPass = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        //check if user exists
        const user = app.db
            .prepare('SELECT * FROM players WHERE id = ? AND reset_flag = ?')
            .get(id, "TRUE");

        if (!user) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        //check expiration of password reset process
        if (Date.now() - user.reset_time > 120000) {
            return res.status(401).send({ message: "Password reset link already expired" });
        }

        res.status(200).send({ message: 'Authorized' });
    } catch (error) {
        res.status(500).send({ error: error });
    }
}

export const resetPassword = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    try {
        const { email } = req.body;

        //check if email is provided
        if (!email)
            return res.status(401).send({ error: "Email should be provided" })
    
        const user = app.db
                    .prepare('SELECT * from players WHERE email = ?')
                    .get(email);
        
        //check if user exists
        if (!user) {
            return res.status(401).send({ error: "Email is not linked to any account" }) 
        }

        app.db
            .prepare('UPDATE players  SET reset_flag = ?, reset_time = ? WHERE email = ?')
            .run("TRUE", Date.now(), email);
        
        const pinCode = Math.floor(100000 + Math.random() * 900000);
        const urlReset = `https://localhost:3000/reset-password/new?id=${user.id}&token=${pinCode}`;

        const mailOptions = {
            from: process.env.GMAIL_USERNAME,
            to: email,
            subject: 'Reset Password',
            text: `here is the link to reset your password : ${urlReset}`
        };     

        app.mailer.sendMail(mailOptions, function (err: Error, info: any) {
            if (err) {
                return res.status(401).send({ error: err })
            } else {
                return res.status(200).send({ message: info.response })
            }
        })

        return res.status(200).send({ message: pinCode });
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

export const verifyResetPin = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    try {
        const { id, password } = req.body;

        //check if email is provided
        if (!password)
            return res.status(401).send({ error: "Password should be provided" })
    

        const user = app.db
                    .prepare('SELECT * from players WHERE id = ?')
                    .get(id);
        
        //check if user exists
        if (!user) {
            return res.status(401).send({ error: "User not found" }) 
        }
        
        const isMatch = await bcrypt.compare(password, user?.password);

        if (isMatch) {
            return res.status(401).send({ message: 'The password should be different from any password set before' });
        }

        const hashedPass: string = await bcrypt.hash(password, 10);

        //set new password
        app.db
            .prepare('UPDATE players SET password = ? WHERE id = ?')
            .run(hashedPass, id);

        app.db
            .prepare('UPDATE players SET reset_flag = ? WHERE id = ?')
            .run(id, "FALSE");

        return res.status(200).send({ message: 'Reset password success' });
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}