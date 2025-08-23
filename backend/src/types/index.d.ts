import Fastify from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import fastifyJwt from "@fastify/jwt";
import type { FastifyJwtNamespace, FastifyJwtVerifyOptions, JWT } from "@fastify/jwt";

declare const app: Fastify.FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, Fastify.FastifyBaseLogger, Fastify.FastifyTypeProviderDefault> & PromiseLike<Fastify.FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, Fastify.FastifyBaseLogger, Fastify.FastifyTypeProviderDefault>> & {
    __linterBrands: "SafePromiseLike";
};
export default app;

declare module 'fastify' {
    export interface FastifyInstance {
        db: DatabaseType;
        jwtAuth: any;
        jwtLoginCheck: any
        intra42Oauth: OAuth2Namespace;
        jwt: fastifyJwt.JWT
        jwt: {
            jwt0: {
              sign: typeof import('@fastify/jwt')['sign'];
              verify: typeof import('@fastify/jwt')['verify'];
              decode: typeof import('@fastify/jwt')['decode'];
              cookie: { cookieName: string; signed: boolean };
            },
            jwt1: {
              sign: typeof import('@fastify/jwt')['sign'];
              verify: typeof import('@fastify/jwt')['verify'];
              decode: typeof import('@fastify/jwt')['decode'];
              cookie: { cookieName: string; signed: boolean };
            },
            jwt2: {
                sign: typeof import('@fastify/jwt')['sign'];
                verify: typeof import('@fastify/jwt')['verify'];
                decode: typeof import('@fastify/jwt')['decode'];
                cookie: { cookieName: string; signed: boolean };
              };
        };
    }

};