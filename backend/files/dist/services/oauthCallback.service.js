import app from "../server.js";
export const redirectPath = async (req, res) => {
    app.intra42Oauth.generateAuthorizationUri(req, res, (err, authorizationEndpoint) => {
        if (err)
            res.status(500).send({ error: "Oauth redirect failed error : " });
        res.redirect(authorizationEndpoint);
    });
};
export const oauthCallback = async (req, res) => {
    try {
        const { accessToken, refreshToken } = req.cookies;
        if (refreshToken || accessToken)
            return res.status(400).send({ error: "Unauthorized" });
        let user = {};
        let newUsername = undefined;
        const { token } = await app.intra42Oauth.getAccessTokenFromAuthorizationCodeFlow(req);
        const resData = await fetch("https://api.intra.42.fr/v2/me", {
            headers: { Authorization: `Bearer ${token.access_token}` },
        });
        const userData = await resData.json();
        const email = userData.email, username = userData.login, intraId = userData.id;
        //check if another user has the same email or username
        user = app.db.prepare("SELECT * FROM players WHERE email = ?").get(email);
        //check if user already exists
        if (!user)
            user = app.db.prepare("SELECT * from players WHERE intra_id = ?").get(intraId);
        if (!user) {
            //check if username already exists
            user = app.db.prepare("SELECT * FROM players WHERE username = ?").get(username);
            if (user)
                newUsername = username + "_" + intraId;
            //add user to DB
            app.db.prepare("INSERT INTO players(intra_id, email, username) VALUES (?, ?, ?)").run(intraId, email, newUsername ? newUsername : username);
            app.db.prepare("UPDATE players SET avatar = ? WHERE intra_id = ?").run(userData.image.link, intraId);
            user = app.db.prepare("SELECT * from players WHERE intra_id = ?").get(intraId);
            app.db.prepare("INSERT INTO Settings(userId) VALUES (?)").run(user?.id);
        }
        //fetch the user
        // if (!user) user = app.db.prepare("SELECT * FROM players WHERE intra_id = ?").get(intraId);
        const twoFA_activated = user?.secret_otp ? true : false;
        if (twoFA_activated) {
            const loginToken = app.jwt.jwt0.sign({ id: user?.id, email: user?.email, username: user?.username }, { expiresIn: "60s" });
            res.setCookie("loginToken", loginToken, {
                path: "/",
                secure: true,
                httpOnly: true,
                sameSite: "lax",
                maxAge: 60,
            });
            return res.redirect(`https://${process.env.VITE_HOST}:${process.env.VITE_PORT}/verify?email=` + user?.email);
        }
        //sign new JWT tokens
        const access = app.jwt.jwt1.sign({ id: user?.id, email: user?.email, username: user?.username }, { expiresIn: "900s" });
        const refresh = app.jwt.jwt2.sign({ id: user?.id, email: user?.email, username: user?.username }, { expiresIn: "1d" });
        //set JWT token as cookie
        res.setCookie("accessToken", access, {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 900,
        });
        res.setCookie("refreshToken", refresh, {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 86400,
        });
        res.clearCookie("oauth2-redirect-state", {
            path: "/intra42",
        });
        // const path = newUsername ? "select-username" : "avatar";
        return res.redirect(`https://${process.env.VITE_HOST}:${process.env.VITE_PORT}/avatar`);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: "Failed to register using intra42" });
    }
};
//# sourceMappingURL=oauthCallback.service.js.map