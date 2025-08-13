import fp from "fastify-plugin";
import app from "../server.js";
import fastifyJwt from "@fastify/jwt";
export const jwtPlugin = fp(async function (fastify, opts) {
    app.decorate('jwtAuth', async function (req, res) {
        try {
            await req.jwtVerify();
        }
        catch (error) {
            res.status(401).send({ message: "Unauthorized resource" });
        }
    });
});
//# sourceMappingURL=jwt.js.map