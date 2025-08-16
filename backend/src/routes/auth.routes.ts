import { type FastifyPluginAsync } from "fastify";
import app from "../server.js"
import { loginUser } from "../services/login.service.js"
import { registerUser } from "../services/register.service.js"
import { getUsers } from "../services/getUsers.service.js"
import { fetchUser } from "../services/user.service.js"

export const authRoutes: FastifyPluginAsync = async() => {
    app.get("/", { onRequest: [ app.jwtAuth ] }, getUsers);
    app.get("/user", { onRequest: [ app.jwtAuth ] }, fetchUser);
    app.post('/login', loginUser);
    app.post('/register', registerUser);
}