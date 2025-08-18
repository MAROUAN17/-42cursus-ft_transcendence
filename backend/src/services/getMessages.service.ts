import type { FastifyReply, FastifyRequest } from "fastify";
// import type {User} from "../models/user.js"
import app from "../server.js";
import type {
  Payload,
  messagePacket,
  messagePacketDB,
} from "../models/chat.js";

export const getMessages = async (
  req: FastifyRequest<{ Params: { user: string } }>,
  res: FastifyReply
) => {
  try {
    const targetUser = req.params.user;
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
    const user = payload.username;
    const query: messagePacketDB[] = app.db
      .prepare(
        "SELECT * FROM messages WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?) ORDER BY createdAt DESC"
      )
      .all(user, targetUser, targetUser, user) as messagePacketDB[];
    const messages: messagePacket[] = query.map((row) => ({
      id: row.id,
      from: row.sender,
      type: "message",
      isDelivered: true,
      to: row.recipient,
      message: row.message,
      isRead: row.isRead,
      createdAt: row.createdAt,
    }));
    res.status(200).send({ data: messages });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
