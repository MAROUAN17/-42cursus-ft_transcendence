//this file for where we create the fastify instance and register all the plugins
import Sensible from "@fastify/sensible";
import fastifyFormbody from "@fastify/formbody";
import { type FastifyInstance, type FastifyPluginOptions } from "fastify"
import { dbConnection } from "./plugins/db.js"
import { authRoutes } from "./routes/auth.routes.js";
import { jwtPlugin } from "./plugins/jwt.js";


export default async function App(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
    await fastify.register(Sensible);
    await fastify.register(dbConnection);
    await fastify.register(fastifyFormbody);
    await fastify.register(jwtPlugin);
    


    //routes of auth
    await fastify.register(authRoutes);
}
