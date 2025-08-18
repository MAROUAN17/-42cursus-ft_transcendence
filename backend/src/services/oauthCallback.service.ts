import type { FastifyRequest, FastifyReply } from "fastify";
import app from "../server.js"
import type { User } from "../models/user.model.js";

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
        let user = {} as User | undefined;
        const { token } = await app.intra42Oauth.getAccessTokenFromAuthorizationCodeFlow(req);

        const resData = await fetch('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${token.access_token}` }
        })
        const userData = await resData.json();

        const email = userData.email, username = userData.login;
        
        //check if user already exists
        if (username) {
            user = app.db
                .prepare('SELECT * from players WHERE username = ?')
                .get(username) as User | undefined;
        }
        if (!user) {
            app.db
                .prepare('INSERT INTO players(email, username) VALUES (?, ?)')
                .run(email, username);
        }

        const tokenJWT = app.jwt.sign({ email: email, username: username }, { expiresIn: '1d' });

        //set JWT token as cookie
        return res.setCookie('token', tokenJWT, {
            path: '/',
            secure: false,
            httpOnly: true, 
            sameSite: 'lax',
            maxAge: 10
        }).redirect("http://localhost:5173/");
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: error });
    }
}
