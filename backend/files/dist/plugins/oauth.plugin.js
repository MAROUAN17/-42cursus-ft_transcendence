import fp from "fastify-plugin";
import fastifyOauth2 from "@fastify/oauth2";
import { vaultClient } from "../server.js";
export const oauthPlugin = fp(async function (fastify, opts) {
    const clientSecrets = await vaultClient.read("secret/oauth");
    await fastify.register(fastifyOauth2, {
        name: "intra42Oauth",
        scope: ["public"],
        credentials: {
            client: {
                id: clientSecrets.data.CLIENT_UUID,
                secret: clientSecrets.data.CLIENT_SECRET,
            },
            auth: {
                authorizeHost: "https://api.intra.42.fr",
                authorizePath: "/oauth/authorize",
                tokenHost: "https://api.intra.42.fr",
                tokenPath: "/oauth/token",
            },
        },
        startRedirectPath: "/intra42/login",
        callbackUri: `https://${process.env.NGINX_HOST}:5000/intra42/login/callback`,
    });
});
//# sourceMappingURL=oauth.plugin.js.map