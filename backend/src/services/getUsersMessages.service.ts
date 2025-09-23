import type { FastifyReply, FastifyRequest } from "fastify";
import type { User, userInfos } from "../models/user.model.js";
import app from "../server.js";
import type { Payload, UsersLastMessage, messagePacket, messagePacketDB } from "../models/chat.js";

export const getUsersMessages = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token: string = req.cookies.accessToken!;
    try {
      var payload = app.jwt.jwt1.verify(token) as Payload;
    } catch (error) {
      res.status(401).send({ error: "JWT_EXPIRED" });
      return;
    }
    const currUserId = payload.id;
    let usersAndMessages: UsersLastMessage[] = [];
    const users: userInfos[] = app.db.prepare("SELECT id, username, email, avatar, online FROM players WHERE id != ?").all(currUserId) as userInfos[];
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
        .prepare("SELECT COUNT(*) AS count FROM messages WHERE (sender_id = ? AND recipient_id = ?) AND isRead = false")
        .get(user.id, currUserId).count;
      const checkSelfBlock = app.db
        .prepare("SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?")
        .get(user.id.toString(), payload.id.toString());
      const checkUserBlock = app.db
        .prepare("SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?")
        .get(payload.id.toString(), user.id.toString());
      let blockedByUser: boolean = false;
      let blockedByOther: boolean = false;
      if (checkUserBlock) blockedByUser = true;
      else if (checkSelfBlock) blockedByOther = true;
      usersAndMessages.push({
        user,
        unreadCount,
        blockedByUser,
        blockedByOther,
        lastMessage,
      });
    });
    res.status(200).send({ data: usersAndMessages });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
