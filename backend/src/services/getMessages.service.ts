import type { FastifyReply, FastifyRequest } from "fastify";
// import type {User} from "../models/user.js"
import app from "../server.js";
import type {
  Payload,
  messagePacket,
  messagePacketDB,
} from "../models/chat.js";

export const getMessages = async (
  req: FastifyRequest<{ Params: { user: number } }>,
  res: FastifyReply
) => {
  try {
    const targetUser : number = req.params.user;
    const token = req.cookies.token;
    let payload;
    if (token) {
      try {
        payload = app.jwt.verify(token) as Payload;
      } catch (error) {
        console.error("Invalid Token!");
        return;
      }
    } else {
      console.log("Token not found!");
      return;
    }
    const userId = payload.id;
    const query: messagePacketDB[] = app.db
      .prepare(
        "SELECT * FROM messages WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) ORDER BY createdAt DESC"
      )
      .all(userId, targetUser, targetUser, userId) as messagePacketDB[];
    const messages: messagePacket[] = query.map((row) => ({
      id: row.id,
      sender_id: row.sender_id,
      type: "message",
      isDelivered: true,
      recipient_id: row.recipient_id,
      message: row.message,
      isRead: row.isRead,
      createdAt: row.createdAt,
    }));
    res.status(200).send({ data: messages });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
