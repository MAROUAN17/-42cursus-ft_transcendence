//this is the file where we start the server
import Fastify from "fastify";
import App from "./app.js";
import fastifyEnv from "@fastify/env";
import fastifyJwt from "@fastify/jwt";
import { options } from "./plugins/env.js"
import cors from '@fastify/cors'

const app = Fastify({
    logger: true
});

async function start(): Promise<void> {
  await app.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600
  })
  await app.register(fastifyEnv, options)
  await app.register(fastifyJwt, { secret: process.env.JWT_SIGNING_KEY! });
  await app.register(App);

  await app.listen({
    host: '0.0.0.0',
    port: Number(process.env.PORT) | 8080
  });
}

start().catch(err => {
  console.log(err);
  process.exit(1);
})

export default app;

