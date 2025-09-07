import type { FastifyReply, FastifyRequest } from "fastify";
import type { Payload } from "../models/chat.js";
import app from "../server.js";

export const fetchUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    // const { username } = req.params;
    const accessToken = req.cookies.accessToken;

    const infos = app.jwt.jwt1.decode(accessToken!) as Payload | null;
    res.status(200).send({ infos: infos });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const fetchProfileUser = async (
  req: FastifyRequest<{ Params: { username?: string } }>,
  res: FastifyReply
) => {
  try {
    const { username } = req.params;

    const accessToken = req.cookies.accessToken;
    const infos = app.jwt.jwt1.decode(accessToken!) as Payload | null;

    if (!username || username == infos?.username) {
      return res.status(200).send({ infos: infos, profileType: "me" });
    }

    const user = app.db
      .prepare("SELECT * FROM players WHERE username = ?")
      .get(username);
    if (!user) return res.status(404).send({ message: "User not found" });
    else {
      return res.status(200).send({ infos: user, profileType: "other" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const checkBlock = async (
  req: FastifyRequest<{ Params: { username?: string } }>,
  res: FastifyReply
) => {
  try {
    const { username } = req.params;

    const accessToken = req.cookies.accessToken;
    const payload = app.jwt.jwt1.decode(accessToken!) as Payload | null;

    if (username) {
      const user = app.db
        .prepare("SELECT * FROM players WHERE username = ?")
        .get(username);

      if (user) {
        const checkBlocked = app.db
          .prepare(
            "SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?"
          )
          .get(user.id, payload?.id.toString());

        console.log("blocked user -> ", checkBlocked);

        if (checkBlocked)
          return res.status(404).send({ message: "user not found" });
        res.status(200).send({ message: "you can see user profile" });
      }
    }
    return res.status(200);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
