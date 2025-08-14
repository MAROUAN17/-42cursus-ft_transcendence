//this file for where we create the fastify instance and register all the plugins
import Sensible from "@fastify/sensible";
import app from "./server.js";
import fastifyFormbody from "@fastify/formbody";
import { type FastifyInstance, type FastifyPluginOptions } from "fastify"
import { dbConnection } from "./plugins/db.js"
import { authRoutes } from "./routes/auth.routes.js";
import { jwtPlugin } from "./plugins/jwt.js";
import websocketPlugin from "@fastify/websocket";


export default async function App(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
    await app.register(Sensible);
    await app.register(dbConnection);
    await app.register(fastifyFormbody);
    await app.register(jwtPlugin);
    await app.register(websocketPlugin);

    //routes of auth
    await app.register(authRoutes);
}
