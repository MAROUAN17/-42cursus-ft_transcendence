import type { FastifyRequest, FastifyReply } from "fastify";
import app from "../server.js";
import type { User } from "../models/user.model.js";

export const redirectPath = async (req: FastifyRequest, res: FastifyReply) => {
  app.intra42Oauth.generateAuthorizationUri(
    req,
    res,
    (err, authorizationEndpoint) => {
      if (err) console.log(err);
      res.redirect(authorizationEndpoint);
    }
  );
};

export const oauthCallback = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { access, refresh } = req.cookies;

    if (refresh || access)
      return res.status(401).send({ error: "Unauthorized" });

    let user = {} as User | undefined;

    const { token } =
      await app.intra42Oauth.getAccessTokenFromAuthorizationCodeFlow(req);

    const resData = await fetch("https://api.intra.42.fr/v2/me", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });

    const userData = await resData.json();

    const email = userData.email,
      username = userData.login,
      intraId = userData.id;

    //check if user already exists
    if (intraId) {
      user = app.db
        .prepare("SELECT * from players WHERE intra_id = ?")
        .get(intraId) as User | undefined;
    }

    if (!user) {
      app.db
        .prepare(
          "INSERT INTO players(intra_id, email, username) VALUES (?, ?, ?)"
        )
        .run(intraId, email, username);

      app.db
        .prepare("UPDATE players SET avatar = ? WHERE intra_id = ?")
        .run(userData.image.link, intraId);

      user = app.db
        .prepare("SELECT * from players WHERE intra_id = ?")
        .get(intraId) as User | undefined;
    }

    //sign new JWT tokens
    const accessToken = app.jwt.jwt1.sign(
      { id: user?.id, email: user?.email, username: user?.username },
      { expiresIn: "900s" }
    );
    const refreshToken = app.jwt.jwt2.sign(
      { id: user?.id, email: user?.email, username: user?.username },
      { expiresIn: "1d" }
    );

    //set JWT token as cookie
    res.setCookie("accessToken", accessToken, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 900,
    });

    res.setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 86400,
    });

    return res.redirect("https://localhost:3000/avatar");
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
