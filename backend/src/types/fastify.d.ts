import Fastify, { type onRequestHookHandler } from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import fastifyJwt from "@fastify/jwt";
import type {
  FastifyJwtNamespace,
  FastifyJwtVerifyOptions,
  JWT,
} from "@fastify/jwt";
import type { Transporter } from "nodemailer";

declare module "fastify" {
  export interface FastifyInstance {
    db: DatabaseType;
    jwtAuth: onRequestHookHandler;
    intra42Oauth: OAuth2Namespace;
    jwt: fastifyJwt.JWT;
    mailer: nodemailer.Transporter;
    jwt0: {
      sign: typeof import("@fastify/jwt")["sign"];
      verify: typeof import("@fastify/jwt")["verify"];
      decode: typeof import("@fastify/jwt")["decode"];
      cookie: { cookieName: string; signed: boolean };
    };
    jwt1: {
      sign: typeof import("@fastify/jwt")["sign"];
      verify: typeof import("@fastify/jwt")["verify"];
      decode: typeof import("@fastify/jwt")["decode"];
      cookie: { cookieName: string; signed: boolean };
    };
    jwt2: {
      sign: typeof import("@fastify/jwt")["sign"];
      verify: typeof import("@fastify/jwt")["verify"];
      decode: typeof import("@fastify/jwt")["decode"];
      cookie: { cookieName: string; signed: boolean };
    };
  }
}
