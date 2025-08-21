import fp from "fastify-plugin";
import app from "../server.js"
import type { FastifyReply, FastifyRequest } from "fastify";
import { type userInfos } from "../models/user.model.js";


export const jwtPlugin = fp(async function(fastify, opts) {
    app.decorate('jwtAuth', async function(req: FastifyRequest, res: FastifyReply): Promise<any> {
        try {
            const refreshToken = req.cookies.refreshToken;
            await app.jwt.jwt2.verify(refreshToken);
            try {
                const OldAccessToken = req.cookies.accessToken;
                await app.jwt.jwt1.verify(OldAccessToken);
            } catch (error) {
                const infos = app.jwt.jwt2.decode(refreshToken!) as userInfos | undefined;
                const newAccessToken = app.jwt.jwt1.sign({ email: infos?.email, username: infos?.username }, { expiresIn: '10s' });
                res.status(200).setCookie('accessToken', newAccessToken, {
                    path: '/',
                    secure: true,
                    httpOnly: true, 
                    sameSite: 'lax',
                    maxAge: 10
                }).send({ message: "another access token generated!" });
            }

        } catch (error: any) {
            res.code(401).send({ error: error.message });
        }
    })
});