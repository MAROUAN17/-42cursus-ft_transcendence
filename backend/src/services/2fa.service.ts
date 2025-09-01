import type { FastifyRequest, FastifyReply } from "fastify";
import { type User, type LoginBody, type userInfos } from "../models/user.model.js"
import app from "../server.js";
import qrcode from "qrcode";
import { authenticator } from "otplib";

export const setup2FA = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    const loginToken = req.cookies.loginToken;
    const refreshToken = req.cookies.refreshToken;
    if (loginToken || refreshToken)
        return res.status(401).send({ error: 'User already setup 2FA' });

    const { email } = req.body;

    //find user
    const user = app.db
        .prepare('SELECT * FROM PLAYERS WHERE email = ?')
        .get(email) as User;

    if (user.twoFA_flag == true) {
        return res.status(401).send({ error: 'User already setup 2FA' });
    }

    const secret = authenticator.generateSecret();

    //insert secret into the db
    app.db
        .prepare('UPDATE players SET secret_otp = ? WHERE email = ?')
        .run(secret, email);

    const otpath = authenticator.keyuri(email!, "OTP APP", secret);
    const qrCode = await qrcode.toDataURL(otpath);

    return qrCode;
}

export const verifySetup2FA = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    try {
        const { token, email } = req.body;

        //find user
        const user = app.db
            .prepare('SELECT * FROM PLAYERS WHERE email = ?')
            .get(email) as User;

        if (user.twoFA_flag == true) {
            return res.status(401).send({ error: 'User already setup 2FA' });
        }

        const secret = user.secret_otp;
        const isValid = authenticator.verify({ token: token, secret: secret });

        if (isValid) {
            app.db
                .prepare('UPDATE players SET twoFA_flag = ? WHERE email = ?')
                .run('true', email);
            return res.status(200).send({ message: "Valid OTP code And user registered" });
        }
        
        //drop user from DB if qrcode is not verified
        app.db
            .prepare('DELETE FROM players WHERE email = ?')
            .run(email);

        return res.status(401).send({ error: "Invalid otp code" });  
    } catch (error: any) {
        const { email } = req.body;
        app.db
            .prepare('DELETE FROM players WHERE email = ?')
            .run(email);
        res.status(500).send({ error: error.message });
    }
}

export const verify2FA = async (req: FastifyRequest<{Body: LoginBody}>, res: FastifyReply) => {
    //verify login tmp token
    const loginToken = req.cookies.loginToken;
    if (!loginToken) {
        return res.status(401).send({ error: 'Unauthorized' });
    }

    const userInfos = await app.jwt.jwt0.verify(loginToken) as userInfos | undefined;

    const secret = authenticator.generateSecret();

    //insert secret into the db
    app.db
        .prepare('UPDATE players SET secret_otp = ? WHERE email = ?')
        .run(secret, userInfos?.email);

    const user = app.db
        .prepare('SELECT * FROM PLAYERS WHERE email = ?')
        .get(userInfos?.email) as User;

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
        const isValid = authenticator.verify({ token: token, secret: secret });

        if (isValid) {
            //sign new JWT tokens
            const accessToken = app.jwt.jwt1.sign({ id:user.id, email:user.email, username:user.username }, { expiresIn: '10s' });
            const refreshToken = app.jwt.jwt2.sign({ id:user.id, email:user.email, username:user.username }, { expiresIn: '1d' });
        
            //set JWT token as cookie
            res.setCookie('accessToken', accessToken, {
                path: '/',
                secure: true,
                httpOnly: true, 
                sameSite: 'lax',
                maxAge: 10
            });

            return res.setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                httpOnly: true, 
                sameSite: 'lax',
                maxAge: 86400
            }).status(200).send({ message: "Valid OTP code" });
        }
        return res.status(401).send({ error: "INVALID_OTP" });  
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}