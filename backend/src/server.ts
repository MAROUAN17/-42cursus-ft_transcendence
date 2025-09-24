//this is the file where we start the server
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Fastify, { type RequestQuerystringDefault } from "fastify";
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
  key: fs.readFileSync("../ssl/server.key"),
  cert: fs.readFileSync("../ssl/server.crt"),
};

export const pump = util.promisify(pipeline);

const app = Fastify({
  logger: true,
  https: httpsOptions,
});

const vaultToken: string = fs.readFileSync("./vault/token.txt", "utf8").trim();
const vaultCert: string = fs.readFileSync("./vault/certificate.pem", "utf8");
export const vaultClient = vault({
  endpoint: "https://localhost:8200",
  token: vaultToken,
  requestOptions: {
    ca: vaultCert,
  },
});

async function start(): Promise<void> {
  const jwtSecrets = await vaultClient.read("secret/jwt");
  await app.register(cors, {
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "player-id"],
    credentials: true,
    maxAge: 600,
  });
  await app.register(fastifyEnv, options);
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
  await app.register(multipart);
  await app.register(websocketPlugin);
  await app.register(mailTransporter);
  await app.register(App);

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
