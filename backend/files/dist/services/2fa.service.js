import {} from "../models/user.model.js";
import app from "../server.js";
import qrcode from "qrcode";
import { authenticator } from "otplib";
export const setup2FA = async (req, res) => {
    const token = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(token);
    const secret = authenticator.generateSecret();
    const otpath = authenticator.keyuri(payload?.email, "OTP APP", secret);
    const qrCode = await qrcode.toDataURL(otpath);
    return [qrCode, secret];
};
export const deleteSetup2FA = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const payload = app.jwt.jwt1.verify(token);
        if (!payload.id)
            return res.status(404).send({ error: "User not found" });
        app.db.prepare("UPDATE players SET secret_otp = ? WHERE id = ?").run(null, payload?.id);
        res.status(200).send({ message: "2fa deleted successfully" });
    }
    catch (error) {
        res.status(500).send({ error: "Error while 2fa deletion" });
    }
};
export const verifySetup2FA = async (req, res) => {
    try {
        const { token, secret } = req.body;
        const accessToken = req.cookies.accessToken;
        const payload = app.jwt.jwt1.verify(accessToken);
        const isValid = authenticator.verify({ token: token, secret: secret });
        if (isValid) {
            app.db.prepare("UPDATE players SET secret_otp = ? WHERE id = ?").run(secret, payload?.id);
            return res.status(200).send({ message: "Valid OTP code And user registered" });
        }
        return res.status(401).send({ error: "Invalid otp code" });
    }
    catch (err) {
        res.status(500).send({ error: "Error occurred while verifying 2FA setup" });
    }
};
export const verify2FAToken = async (req, res) => {
    try {
        let user = {};
        const loginToken = req.cookies.loginToken;
        if (!loginToken)
            return res.status(401).send({ error: "UNAUTHORIZED" });
        const payload = app.jwt.jwt0.verify(loginToken);
        let { token, email } = req.body;
        email = email.toLowerCase();
        //find user
        if (email.includes("@")) {
            user = app.db.prepare("SELECT * FROM PLAYERS WHERE email = ?").get(email);
        }
        else {
            user = app.db.prepare("SELECT * FROM PLAYERS WHERE username = ?").get(email);
        }
        if (!user)
            return res.status(404).send({ error: "User not found" });
        const secret = user?.secret_otp;
        const isValid = authenticator.verify({ token: token, secret: secret });
        if (isValid) {
            const refreshOptions = {
                path: "/",
                secure: true,
                httpOnly: true,
                sameSite: "lax",
            };
            const accessOptions = {
                path: "/",
                secure: true,
                httpOnly: true,
                sameSite: "lax",
            };
            if (payload.rememberMe) {
                refreshOptions.maxAge = 86400;
                accessOptions.maxAge = 900;
            }
            //sign new JWT tokens
            const accessToken = app.jwt.jwt1.sign({ id: user.id, email: user.email, username: user.username }, { expiresIn: "900s" });
            const refreshToken = app.jwt.jwt2.sign({ id: user.id, email: user.email, username: user.username }, { expiresIn: "1d" });
            //clear login token
            res.clearCookie("loginToken", {
                path: "/",
                secure: true,
                httpOnly: true,
                sameSite: "lax",
            });
            //set JWT token as cookie
            res.setCookie("accessToken", accessToken, accessOptions);
            res.setCookie("refreshToken", refreshToken, refreshOptions);
            return res.status(200).send({ message: "Valid OTP code" });
        }
        return res.status(401).send({ error: "INVALID_OTP" });
    }
    catch (error) {
        res.status(500).send({ error: "Error occurred while verifying 2FA OTP" });
    }
};
//# sourceMappingURL=2fa.service.js.map