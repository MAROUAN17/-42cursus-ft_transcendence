import type { FastifyRequest, FastifyReply } from "fastify";
import app from "../server.js";
import type { Payload } from "../models/chat.js";

export const logoutUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const accessToken = req.cookies.accessToken;
    const payload = app.jwt.jwt1.decode(accessToken!) as Payload;

    const user = app.db
      .prepare("SELECT * FROM players WHERE id = ?")
      .get(payload.id);

    if (!user) {
      return res.status(404).send({ error: "USER NOT FOUND" });
    }

    const updateUserState = app.db
      .prepare(
        "UPDATE players SET logged_in = ? WHERE id = ?"
      )
      .run(0, payload.id);

    if (updateUserState.changes == 0)
      return res.status(500).send({ error: "Error occured" });

    if (user.intra_id)
      res.clearCookie("oauth2-redirect-state", {
        path: "/intra42",
      });

    res
      .clearCookie("refreshToken", {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      })
      .clearCookie("accessToken", {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      });
  } catch (err) {
    res.status(500).send({ error: 'Unexpected error occurred' });
  }
};
