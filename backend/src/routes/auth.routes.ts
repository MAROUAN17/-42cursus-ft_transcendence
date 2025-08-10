import { type FastifyPluginAsync } from "fastify";
import app from "../server.js"
import { loginUser } from "../services/login.service.js"
import { registerUser } from "../services/register.service.js"

export const authRoutes: FastifyPluginAsync = async() => {
    app.post('/login', loginUser);
    app.post('/register', registerUser);
}