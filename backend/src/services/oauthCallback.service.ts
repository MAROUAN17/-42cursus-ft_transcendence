import type { FastifyRequest, FastifyReply } from "fastify";
import app from "../server.js"

export const redirectPath = async (req: FastifyRequest, res: FastifyReply) => {
    app.intra42Oauth.generateAuthorizationUri(
        req,
        res,
        (err, authorizationEndpoint) => {
            if (err) console.log(err);
            res.redirect(authorizationEndpoint);
    })
}


export const oauthCallback = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const { token } = await app.intra42Oauth.getAccessTokenFromAuthorizationCodeFlow(req);

        const resData = await fetch('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${token.access_token}` }
        })

        const userInfo = await resData.json();

        console.log(userInfo.length);

        res.status(200).send({ data: userInfo });
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: error });
    }
}
