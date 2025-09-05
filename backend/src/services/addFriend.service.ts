import type { FastifyRequest, FastifyReply } from "fastify";
import type { Payload } from "../models/chat.js";
import app from "../server.js";

export const addFriend = async (
  req: FastifyRequest<{ Params: { id: number } }>,
  res: FastifyReply
) => {
  try {
    const { id } = req.params;
    const token = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(token) as Payload;

    const checkFriend = app.db
      .prepare(
        "SELECT key FROM json_each((SELECT friends FROM players WHERE id = ?)) WHERE value = ?"
      )
      .get(payload.id, id);
    if (!checkFriend) {
      const addedFriend = app.db
        .prepare(
          "UPDATE players SET friends = json_insert(friends, '$[#]', ?) WHERE id = ?"
        )
        .run(id, payload.id);
      if (addedFriend.changes == 0)
        return res.status(404).send({ error: "Error" });
      res.status(200).send({ message: "Friend added" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
