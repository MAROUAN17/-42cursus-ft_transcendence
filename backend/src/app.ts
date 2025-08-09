//this file for where we create the fastify instance and register all the plugins
import Sensible from "@fastify/sensible";
import { type FastifyInstance, type FastifyPluginOptions } from "fastify"
import app from "./server.js";
import { dbConnection } from "./plugins/db.js"
import {userRoutes} from "./routes/user.js";

export default async function App(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
    await app.register(Sensible);
    await app.register(dbConnection);
    await app.register(userRoutes, '/user');
}
