import type { FastifyRequest, FastifyReply } from "fastify";
import { type User, type LoginBody, type userInfos } from "../models/user.model.js"
import app from "../server.js";
import qrcode from "qrcode";
import { authenticator } from "otplib";

export const verify2FA = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    const { email } = req.body;

    const secret = authenticator.generateSecret();
    //insert secret into the db
    app.db
        .prepare('UPDATE players SET secret_otp = ? WHERE email = ?')
        .run(secret, email);

    const user = app.db
        .prepare('SELECT * FROM PLAYERS WHERE email = ?')
        .get(email) as User;

    const otpath = authenticator.keyuri(email, "OTP APP", user.secret_otp);
    const qrCode = await qrcode.toDataURL(otpath);

    return qrCode;
}

export const verify2FAToken = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    try {
        const { token } = req.body;
        console.log(`OTP -> ${token}`);

        const accessToken = req.cookies.accessToken;
        const infos = app.jwt.jwt1.decode(accessToken!) as userInfos | null;
    
        //find user
        const user = app.db
            .prepare('SELECT * FROM PLAYERS WHERE email = ?')
            .get(infos?.email) as User;

        const secret = user.secret_otp;
        const isValid = authenticator.verify({ token: token, secret:secret });

        if (isValid) {
            return res.status(200).send({ message: "Valid OTP code" });
        }
        return res.status(401).send({ error: "Invalid otp code" });  
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
   

}