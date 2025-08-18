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
    const currUser = payload.username;
    let usersAndMessages: UsersLastMessage[] = [];
    const users: User[] = app.db
      .prepare("SELECT * FROM players")
      .all() as User[];
    users.map((user) => {
      const query: messagePacketDB | undefined = app.db
        .prepare(
          "SELECT * FROM messages WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?) ORDER BY createdAt DESC LIMIT 1"
        )
        .get(user.username, currUser, currUser, user.username);
      const lastMessage: messagePacket | undefined = query
        ? {
            id: query.id,
            from: query.sender,
            type: "message",
            isDelivered: true,
            to: query.recipient,
            message: query.message,
            isRead: query.isRead,
            createdAt: query.createdAt,
          }
        : undefined;
      const unreadCount: number = app.db
        .prepare(
          "SELECT COUNT(*) AS count FROM messages WHERE (sender = ? AND recipient = ?) AND isRead = false"
        )
        .get(user.username, currUser).count;
      console.log("count -> ", unreadCount);
      usersAndMessages.push({ user, unreadCount, lastMessage });
    });
    res.status(200).send({ data: usersAndMessages });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
