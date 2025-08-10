//this file for where we create the fastify instance and register all the plugins
import Sensible from "@fastify/sensible";
import app from "./server.js";
import fastifyFormbody from "@fastify/formbody";
import { type FastifyInstance, type FastifyPluginOptions } from "fastify"
import { dbConnection } from "./plugins/db.js"
import { authRoutes } from "./routes/auth.routes.js";
import { options, schema } from "./plugins/env.js"
import fastifyEnv from "@fastify/env";
import fastifyJwt from "@fastify/jwt";


export default async function App(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
    await app.register(fastifyEnv, options)
    await app.register(Sensible);
    await app.register(dbConnection);
    await app.register(fastifyFormbody);
    await app.register(fastifyJwt, { secret: process.env.JWT_SIGNING_KEY });

    //routes of auth
    await app.register(authRoutes);
}
