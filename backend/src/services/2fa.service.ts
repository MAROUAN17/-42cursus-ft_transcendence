import type { FastifyRequest, FastifyReply } from "fastify";
import { type User, type LoginBody, type userInfos } from "../models/user.model.js"
import app from "../server.js";
import qrcode from "qrcode";
import { authenticator } from "otplib";

export const verify2FA = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    //verify login tmp token
    const loginToken = req.cookies.loginToken;
    if (!loginToken) {
        return res.status(401).send({ error: 'Unauthorized' });
    }

    const userInfos = await app.jwt.jwt0.verify(loginToken) as userInfos | undefined;

    console.log(`user email -> ${userInfos?.email}`);
    const secret = authenticator.generateSecret();
    //insert secret into the db
    app.db
        .prepare('UPDATE players SET secret_otp = ? WHERE email = ?')
        .run(secret, userInfos?.email);

    const user = app.db
        .prepare('SELECT * FROM PLAYERS WHERE email = ?')
        .get(userInfos?.email) as User;

    console.log("secret otp -> ", user.secret_otp);
    const otpath = authenticator.keyuri(userInfos?.email!, "OTP APP", user.secret_otp);
    const qrCode = await qrcode.toDataURL(otpath);

    return qrCode;
}

export const verify2FAToken = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    try {
        const { token } = req.body;

        const loginToken = req.cookies.loginToken;
        if (!loginToken) {
            return res.status(401).send({ error: 'Unauthorized' });
        }

        const infos = await app.jwt.jwt0.decode(loginToken!) as userInfos | null;
    
        console.log(infos?.email);
        //find user
        const user = app.db
            .prepare('SELECT * FROM PLAYERS WHERE email = ?')
            .get(infos?.email) as User;

        const secret = user.secret_otp;
        const isValid = authenticator.verify({ token: token, secret:secret });

        if (isValid) {
            //sign new JWT tokens
            const accessToken = app.jwt.jwt1.sign({ email:user.email, username:user.username }, { expiresIn: '10s' });
            const refreshToken = app.jwt.jwt2.sign({ email:user.email, username:user.username }, { expiresIn: '30s' });
        
            //set JWT token as cookie
            res.setCookie('accessToken', accessToken, {
                path: '/',
                secure: true,
                httpOnly: true, 
                sameSite: 'lax',
                maxAge: 20
            });

            return res.setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                httpOnly: true, 
                sameSite: 'lax',
                maxAge: 30
            }).status(200).send({ message: "Valid OTP code" });
        }
        return res.status(401).send({ error: "Invalid otp code" });  
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
   

}