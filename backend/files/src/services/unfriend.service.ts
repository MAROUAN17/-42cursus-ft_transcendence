import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import type { Payload } from "../models/chat.js";

interface jsonObj {
  key: number;
}

export const unfriendUser = async (
  req: FastifyRequest<{ Params: { id: number } }>,
  res: FastifyReply
) => {
  try {
    if (!req.params.id) return;

    const token = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(token) as Payload;

    console.log('Loggedin user > ', payload.id)
    console.log('requested user > ', req.params.id)

    //check if user exist && user is a friend
    const checkFriend1: jsonObj = app.db
      .prepare(
        "SELECT key FROM json_each((SELECT friends FROM players WHERE id = ?)) WHERE value = ?"
      )
      .get(payload.id, req.params.id.toString());

    const checkFriend2: jsonObj = app.db
      .prepare(
        "SELECT key FROM json_each((SELECT friends FROM players WHERE id = ?)) WHERE value = ?"
      )
      .get(req.params.id, payload.id.toString());

    if (checkFriend1 == undefined || checkFriend2 == undefined) return;

    const removedFriend = app.db
      .prepare(
        "UPDATE players SET friends = json_remove(friends, '$[' || ? || ']') WHERE id = ?"
      )
      .run(checkFriend1.key.toString(), payload.id);

    const removed = app.db
      .prepare(
        "UPDATE players SET friends = json_remove(friends, '$[' || ? || ']') WHERE id = ?"
      )
      .run(checkFriend2.key.toString(), req.params.id);

    if (removedFriend.changes == 0 || removed.changes == 0)
      return res.status(404).send({ error: "Error" });
    res.status(200).send();
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
