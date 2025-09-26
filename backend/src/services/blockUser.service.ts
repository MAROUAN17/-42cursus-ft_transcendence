import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import type { Payload } from "../models/chat.js";

interface jsonObj {
  key: number;
}

export const blockUser = async (
  req: FastifyRequest<{ Params: { id: number } }>,
  res: FastifyReply
) => {
  try {
    const token = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(token) as Payload;
    const checkBlocked = app.db
      .prepare(
        "SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?"
      )
      .get(payload.id, req.params.id);
    if (checkBlocked != undefined) return;
    const blockedUser = app.db
      .prepare(
        "UPDATE players SET block_list = json_insert(block_list, '$[#]', ?) WHERE id = ?"
      )
      .run(req.params.id, payload.id);
    if (blockedUser.changes == 0)
      return res.status(404).send({ error: "Error" });

    //delete any notifications between blocked user and the loggedin user
    app.db
      .prepare("DELETE from notifications WHERE sender_id IN (?, ?)")
      .run(req.params.id, payload.id);
    app.db
      .prepare("DELETE from notifications WHERE recipient_id IN (?, ?)")
      .run(req.params.id, payload.id);

    //delete friendship between users
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
    console.log("error ->", err);
    res.status(500).send({ error: err });
  }
};
