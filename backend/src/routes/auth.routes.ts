import { type FastifyPluginAsync } from "fastify";
import app from "../server.js"
import { loginUser } from "../services/login.service.js"
import { logoutUser } from "../services/logout.service.js"
import { registerUser } from "../services/register.service.js"
import { getUsers } from "../services/getUsers.service.js"
import { fetchUser } from "../services/user.service.js"
import { oauthCallback } from "../services/oauthCallback.service.js";
import { verify2FA, verify2FAToken } from "../services/2fa.service.js"

export const authRoutes: FastifyPluginAsync = async() => {
    app.post('/login', loginUser);
    app.post('/register', registerUser);
    app.get("/", { onRequest: [ app.jwtAuth ] }, getUsers);
    app.get("/user", { onRequest: [ app.jwtAuth ] }, fetchUser);
    app.post('/logout', { onRequest: [ app.jwtAuth ] }, logoutUser);
    app.post('/2fa/verify', { onRequest: [ app.jwtAuth ] }, verify2FA);
    app.post('/2fa/verify-token', { onRequest: [ app.jwtAuth ] }, verify2FAToken);

    //remote auth with intra42
    app.get('/intra42/login/callback', oauthCallback);
}