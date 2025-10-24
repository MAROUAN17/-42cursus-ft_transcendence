//this is the file where we start the server
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Fastify, { type FastifyInstance } from "fastify";
import App from "./app.js";
import { options } from "./plugins/env.plugin.js";
import websocketPlugin from "@fastify/websocket";
import fastifyEnv from "@fastify/env";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { chatService } from "./services/chat.service.js";
import { getUsers } from "./services/getUsers.service.js";
import { oauthPlugin } from "./plugins/oauth.plugin.js";
import { mailTransporter } from "./plugins/nodemailer.plugin.js";
import multipart from "@fastify/multipart";
import util from "util";
import { pipeline } from "stream";
import vault from "node-vault";

const httpsOptions = {
  key: fs.readFileSync("./ssl/server.key"),
  cert: fs.readFileSync("./ssl/server.crt"),
};

export const pump = util.promisify(pipeline);

const app: FastifyInstance = Fastify({
  logger: false,
  https: httpsOptions,
});

const vaultToken: string = fs.readFileSync("./vault/token.txt", "utf8").trim();
const vaultCert: string = fs.readFileSync("./vault/certificate.pem", "utf8");
export const vaultClient = vault({
  endpoint: "https://vault:8200",
  token: vaultToken,
  requestOptions: {
    ca: vaultCert,
  },
});

async function start(): Promise<void> {
  const jwtSecrets = await vaultClient.read("secret/jwt");
  await app.register(cors, {
    origin: [`${process.env.VITE_FRONTEND_URL}`, `https://localhost:${process.env.VITE_PORT}`],
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "player-id"],
    credentials: true,
    maxAge: 600,
  });
  await app.register(fastifyCookie);
  await app.register(fastifyJwt, {
    secret: jwtSecrets.data.JWT_TMP_LOGIN,
    cookie: {
      cookieName: "loginToken",
      signed: false,
    },
    namespace: "jwt0",
  });
  await app.register(fastifyJwt, {
    secret: jwtSecrets.data.JWT_ACCESS_TOKEN,
    cookie: {
      cookieName: "accessToken",
      signed: false,
    },
    namespace: "jwt1",
  });
  await app.register(fastifyJwt, {
    secret: jwtSecrets.data.JWT_REFRESH_TOKEN,
    cookie: {
      cookieName: "refreshToken",
      signed: false,
    },
    namespace: "jwt2",
  });
  await app.register(oauthPlugin);
  await app.register(multipart, { limits: { fileSize: 1000000 } });
  await app.register(fastifyEnv, options);
  await app.register(websocketPlugin);
  await app.register(mailTransporter);
  await app.register(App);

  await app.listen({
    host: process.env.BACKEND_HOST as string,
    port: Number(process.env.BACKEND_PORT) || 8080,
  });
}

start().catch((err) => {
  console.log(err);
  process.exit(1);
});

export default app;
