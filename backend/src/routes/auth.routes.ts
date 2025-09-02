import { type FastifyPluginAsync } from "fastify";
import app from "../server.js"
import { loginUser } from "../services/login.service.js"
import { logoutUser } from "../services/logout.service.js"
import { registerUser, verifyRegisterUser } from "../services/register.service.js"
import { getUsers } from "../services/getUsers.service.js"
import { fetchUser } from "../services/user.service.js"
import { oauthCallback } from "../services/oauthCallback.service.js";
import { verify2FAToken, setup2FA, verifySetup2FA } from "../services/2fa.service.js"
import { checkAuth } from "../services/checkAuth.service.js"
import { resetPassword, verifyResetPin, checkResetPass } from "../services/resetPassword.service.js"
import { requestNewToken } from "../services/newAccessToken.service.js";


export const authRoutes: FastifyPluginAsync = async() => {
    app.post('/login', loginUser);
    app.post('/login/verify', checkAuth);
    app.post('/logout', logoutUser);
    app.post('/register/verify', verifyRegisterUser);
    app.post('/register', registerUser);

    //reset password
    app.post('/reset-password', resetPassword);
    app.post('/reset-password/verify', verifyResetPin);
    app.post('/reset-password/check', checkResetPass);

    //request new JWT access token
    app.post('/jwt/new', requestNewToken);

    //get user data
    app.get("/", { onRequest: [ app.jwtAuth ] }, getUsers);
    app.get("/user", { onRequest: [ app.jwtAuth ] }, fetchUser);

    //2fa
    app.post('/2fa/setup', setup2FA);
    app.post('/2fa/setup/verify', verifySetup2FA);
    app.post('/2fa/verify-token', verify2FAToken);

    //remote auth with intra42
    app.get('/intra42/login/callback', oauthCallback);
}