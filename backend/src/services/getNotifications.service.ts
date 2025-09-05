import type { FastifyReply, FastifyRequest } from "fastify";
// import type {User} from "../models/user.js"
import app from "../server.js";
import type { Payload, messagePacket, messagePacketDB } from "../models/chat.js";
import type { notificationPacket, notificationPacketDB } from "../models/webSocket.model.js";

export const getNotifications = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.cookies.accessToken!;
    try {
      var payload = app.jwt.jwt1.verify(token) as Payload;
    } catch (error) {
      res.status(401).send({ error: "JWT_EXPIRED" });
      return;
    }
    const user = payload.username;
    const notifications: notificationPacket[] = app.db
      .prepare(
        "SELECT notifications.*, players.username FROM notifications JOIN players ON notifications.sender_id = players.id WHERE notifications.recipient_id = (SELECT id FROM players WHERE username = ?) ORDER BY notifications.updatedAt DESC"
      )
      .all(user)
      .map((row: notificationPacketDB) => ({
        id: row.id,
        type: row.type,
        username: row.username,
        recipient_id: row.recipient_id,
        sender_id: row.sender_id,
        message: row.message,
        isRead: row.isRead,
        createdAt: row.updatedAt,
        unreadCount: row.unreadCount,
      }));
    // console.log("notifications -> ", notifications);
    res.status(200).send({ data: notifications });
  } catch (err) {
    console.log("FAILED");
    res.status(500).send({ error: err });
  }
};
