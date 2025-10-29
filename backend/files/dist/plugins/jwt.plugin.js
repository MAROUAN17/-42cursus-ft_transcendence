import fp from "fastify-plugin";
import app from "../server.js";
export const jwtPlugin = fp(async function (fastify, opts) {
    app.decorate("jwtAuth", async function (req, res) {
        try {
            const accessToken = req.cookies.accessToken;
            await app.jwt.jwt1.verify(accessToken);
        }
        catch (err) {
            res.code(401).send({ error: "JWT_EXPIRED" });
        }
    });
});
//# sourceMappingURL=jwt.plugin.js.map