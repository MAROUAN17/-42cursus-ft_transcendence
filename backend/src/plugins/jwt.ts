import fp from "fastify-plugin";
import app from "../server.js"
import fastifyJwt from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";


export const jwtPlugin = fp(async function(fastify, opts) {
    app.decorate('jwtAuth', async function(req: FastifyRequest, res: FastifyReply): Promise<any> {
        try {
            await req.jwtVerify();
        } catch (error) {
            res.status(401).send({ message: "Unauthorized resource" });
        }
    })
});