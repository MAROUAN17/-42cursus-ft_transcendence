import type { FastifyRequest, FastifyReply } from "fastify"
import type { LoginBody } from "../models/user.model.js"
import app from "../server.js"

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

        const pinCode = Math.floor(100000 + Math.random() * 900000);

        const mailOptions = {
            from: process.env.GMAIL_USERNAME,
            to: email,
            subject: 'Reset Password',
            text: `here is the code to reset your password -> ${pinCode}`
        };     

        app.mailer.sendMail(mailOptions, function (err: Error, info: any) {
            if (err) {
                console.log(err);
            } else {
                console.log(info.response);
            }
        })

        res.status(200).send({ message: pinCode });
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}