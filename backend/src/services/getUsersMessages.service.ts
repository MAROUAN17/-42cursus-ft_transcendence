import type { FastifyReply, FastifyRequest } from "fastify";
import type { User } from "../models/user.model.js";
import app from "../server.js";
import type {
  Payload,
  UsersLastMessage,
  messagePacket,
  messagePacketDB,
} from "../models/chat.js";

export const getUsersMessages = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const token = req.cookies.token;
    let payload;
    if (token) payload = app.jwt.verify(token) as Payload;
    else return;
    const currUserId = payload.id;
    let usersAndMessages: UsersLastMessage[] = [];
    const users: User[] = app.db
      .prepare("SELECT * FROM players WHERE id != ?")
      .all(currUserId) as User[];
    users.map((user) => {
      const query: messagePacketDB | undefined = app.db
        .prepare(
          "SELECT * FROM messages WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) ORDER BY createdAt DESC LIMIT 1"
        )
        .get(user.id, currUserId, currUserId, user.id);
      const lastMessage: messagePacket | undefined = query
        ? {
            id: query.id,
            sender_id: query.sender_id,
            type: "message",
            isDelivered: true,
            recipient_id: query.recipient_id,
            message: query.message,
            isRead: query.isRead,
            createdAt: query.createdAt,
          }
        : undefined;
      const unreadCount: number = app.db
        .prepare(
          "SELECT COUNT(*) AS count FROM messages WHERE (sender_id = ? AND recipient_id = ?) AND isRead = false"
        )
        .get(user.id, currUserId).count;
      usersAndMessages.push({ user, unreadCount, lastMessage });
    });
    res.status(200).send({ data: usersAndMessages });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
