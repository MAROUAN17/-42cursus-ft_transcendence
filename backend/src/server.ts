//this is the file where we start the server
import fs from "fs"
import { v4 as uuidv4 } from "uuid";
import Fastify, { type RequestQuerystringDefault } from "fastify";
import App from "./app.js";
import { options } from "./plugins/env.plugin.js"
import websocketPlugin from "@fastify/websocket";
import fastifyEnv from "@fastify/env";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";;
import cors from "@fastify/cors";
import { chatService } from "./services/chat.service.js";
import { getUsers } from "./services/getUsers.service.js";
import { oauthPlugin } from "./plugins/oauth.plugin.js";

const httpsOptions = {
  key: fs.readFileSync("../ssl/server.key"),
  cert: fs.readFileSync("../ssl/server.crt")
};

const app = Fastify({
  logger: false,
  https: httpsOptions
});

async function start(): Promise<void> {
  await app.register(cors, {
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  });
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
  await app.register(websocketPlugin);

  // app.get("/send-message", { websocket: true }, chatService.handler);
  await app.listen({
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 8080,
  });
}

start().catch((err) => {
  console.log(err);
  process.exit(1);
});

export default app;
