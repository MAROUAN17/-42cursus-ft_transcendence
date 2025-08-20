import type { FastifyRequest, FastifyReply } from "fastify";
import { type User, type LoginBody, type userInfos } from "../models/user.model.js"
import app from "../server.js";
import qrcode from "qrcode";
import { authenticator } from "otplib";

export const verify2FA = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    const { email } = req.body;


    const secret = authenticator.generateSecret();

    //insert secret into the db
    console.log(`secret before => ${secret}`);
    app.db
        .prepare('UPDATE players SET secret_otp = ? WHERE email = ?')
        .run(secret, email);

    const user = app.db
        .prepare('SELECT * FROM PLAYERS WHERE email = ?')
        .get(email) as User;
    console.log(`secret after => ${user.secret_otp}`);

    const otpath = authenticator.keyuri(email, "OTP APP", user.secret_otp);
    const qrCode = await qrcode.toDataURL(otpath);


    return qrCode;
}

export const verify2FAToken = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    try {
        const { token } = req.body;

        const jwtToken = req.cookies.token;
        const infos = app.jwt.decode(jwtToken!) as userInfos | null;
    
        //find user
        const user = app.db
            .prepare('SELECT * FROM PLAYERS WHERE email = ?')
            .get(infos?.email) as User;

        const secret = user.secret_otp;
        const checkOtp = authenticator.check(token, secret);
        if (checkOtp)
            console.log("VALID OTP");
        const isValid = authenticator.verify({ token: token, secret:secret });
        console.log(isValid);
        if (isValid) {
            return res.status(200).send({ message: "valid!!" });
        }
        return res.status(401).send({ error: "invalid otp code" });  
    } catch (error) {
        res.status(500).send({ error: error });
    }
   

}