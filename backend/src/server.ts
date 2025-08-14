//this is the file where we start the server
import websocketPlugin from "@fastify/websocket";
import { v4 as uuidv4 } from "uuid";
import Fastify, { type RequestQuerystringDefault } from "fastify";
import App from "./app.js";
import fastifyEnv from "@fastify/env";
import fastifyJwt from "@fastify/jwt";
import { options } from "./plugins/env.js";
import cors from "@fastify/cors";
import { chatService } from "./services/chat.service.js";
import { getUsers } from "./services/getUsers.service.js";

const app = Fastify({
  logger: false,
});

async function start(): Promise<void> {
  await app.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  });
  await app.register(fastifyEnv, options);
  await app.register(fastifyJwt, { secret: process.env.JWT_SIGNING_KEY! });
  await app.register(App);
  await app.register(websocketPlugin);

  app.get("/send-message", { websocket: true }, chatService.handler);
  app.get("/users", getUsers);
  await app.listen({
    host: "0.0.0.0",
    port: Number(process.env.PORT) | 8080,
  });
}

start().catch((err) => {
  console.log(err);
  process.exit(1);
});

export default app;
