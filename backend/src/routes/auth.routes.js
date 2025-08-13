import {} from "fastify";
import app from "../server.js";
import { loginUser } from "../services/login.service.js";
import { registerUser } from "../services/register.service.js";
import { getUsers } from "../services/getUsers.service.js";
export const authRoutes = async () => {
    app.get("/", { onRequest: [app.jwtAuth] }, getUsers);
    app.post('/login', loginUser);
    app.post('/register', registerUser);
};
//# sourceMappingURL=auth.routes.js.map