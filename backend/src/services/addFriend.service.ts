import type { FastifyRequest, FastifyReply } from "fastify";
import type { Payload } from "../models/chat.js";
import app from "../server.js";
import { stringify } from "querystring";

export const addFriend = async (
  req: FastifyRequest<{ Params: { id: number } }>,
  res: FastifyReply
) => {
  try {
    const id = req.params.id;
    const token = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(token) as Payload;

    //check notif if already sent
    const notif = app.db
      .prepare(
        "SELECT * from notifications WHERE recipient_id = ? AND sender_id = ? AND type = ?"
      )
      .get(payload.id, id, "friendReq");
    
    console.log('notif > ', notif);
  
    if (notif) {
      const checkFriend = app.db
        .prepare(
          "SELECT key FROM json_each((SELECT friends FROM players WHERE id = ?)) WHERE value = ?"
        )
        .get(payload.id, id);
      if (!checkFriend) {
        const acceptRecipient = app.db
          .prepare(
            "UPDATE players SET friends = json_insert(friends, '$[#]', ?) WHERE id = ?"
          )
          .run(id, payload.id);
        const acceptSender = app.db
          .prepare(
            "UPDATE players SET friends = json_insert(friends, '$[#]', ?) WHERE id = ?"
          )
          .run(payload.id.toString(), id);
        if (acceptRecipient.changes == 0 && acceptSender.changes == 0)
          return res.status(404).send({ error: "Error" });
        res.status(200).send({ message: "Friend added" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
