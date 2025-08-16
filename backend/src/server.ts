//this is the file where we start the server
import Fastify from "fastify";
import App from "./app.js";
import { options } from "./plugins/env.js"
import fastifyEnv from "@fastify/env";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import cors from '@fastify/cors'
import { oauthPlugin } from "./plugins/oauth.js";

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
  await app.register(fastifyCookie);
  await app.register(fastifyEnv, options);
  await app.register(fastifyJwt, { 
    secret: process.env.JWT_SIGNING_KEY!,
    cookie: {
      cookieName: 'token',
      signed: false
    }
  });
  await app.register(oauthPlugin);
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

