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

    const user = app.db
      .prepare("SELECT * FROM players WHERE username = ?")
      .get(username);
    if (!user) return res.status(404).send({ message: "User not found" });
    else {
      return res.status(200).send({ infos: user });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
