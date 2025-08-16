import fp from "fastify-plugin"
import fastifyOauth2 from "@fastify/oauth2";

export const oauthPlugin = fp(async function(fastify, opts) {
    await fastify.register(fastifyOauth2, {
        name: 'intra42Oauth',
        scope: ['public'],
        credentials: {
            client: {
                id: process.env.CLIENT_UUID! as string,
                secret: process.env.CLIENT_SECRET! as string
            },
            auth: {
                authorizeHost: 'https://api.intra.42.fr',
                authorizePath: '/oauth/authorize',
                tokenHost: 'https://api.intra.42.fr',
                tokenPath: '/oauth/token'
            }
        },
        startRedirectPath: '/intra42/login',
        callbackUri: 'http://localhost:8088/intra42/login/callback'
    });
});