//this file for where we create the fastify instance and register all the plugins
import Sensible from "@fastify/sensible";
import fastifyFormbody from "@fastify/formbody";
import app from "./server.js";
import { type FastifyInstance, type FastifyPluginOptions } from "fastify"
import { dbConnection } from "./plugins/db.js"
import { authRoutes } from "./routes/auth.routes.js";
import { jwtPlugin } from "./plugins/jwt.js";


export default async function App(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
    await app.register(Sensible);
    await app.register(dbConnection);
    await app.register(fastifyFormbody);
    await app.register(jwtPlugin);

    //routes of auth
    await app.register(authRoutes);
}
