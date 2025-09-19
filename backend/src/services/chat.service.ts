import fastify from "fastify";
import app from "../server.js";
import { WebSocket } from "ws";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { RequestQuery, Payload, messagePacket } from "../models/chat.js";
import type { ChatPacket, NotificationPacket, notificationPacket, notificationPacketDB, websocketPacket } from "../models/webSocket.model.js";

const clients = new Map<number, WebSocket>();
const messageQueue: websocketPacket[] = [];
let isProcessingQueue: boolean = false;

interface rowInserted {
  changes: number;
  lastInsertRowid: number;
}

function createNotification(currPacket: websocketPacket) {
  const savedNotification: rowInserted = app.db
    .prepare("INSERT INTO notifications(type, sender_id, recipient_id,message) VALUES (?, ?, ?, ?)")
    .run(currPacket.data.type, currPacket.data.sender_id, currPacket.data.recipient_id, currPacket.data.message);
  const senderUsername: string = app.db.prepare("SELECT username FROM players WHERE id = ?").get(currPacket.data.sender_id).username;

  let client = clients.get(currPacket.data.recipient_id);
  if (client) {
    if (currPacket.data.type == "markDelivered" || currPacket.data.type == "block") return;
    const notification: NotificationPacket = {
      type: "notification",
      data: {
        id: savedNotification.lastInsertRowid,
        type: currPacket.data.type,
        username: senderUsername,
        sender_id: currPacket.data.sender_id,
        recipient_id: currPacket.data.recipient_id,
        message: currPacket.data.message!,
        unreadCount: 1,
        createdAt: currPacket.data.createdAt,
      },
    };
    client.send(JSON.stringify(notification));
  }
}

function sendNotification(currPacket: websocketPacket) {
  const notif: notificationPacketDB = app.db
    .prepare("SELECT * FROM notifications WHERE sender_id = ? AND recipient_id = ? AND type = ?")
    .get(currPacket.data.sender_id, currPacket.data.recipient_id, "message");
  let client = clients.get(currPacket.data.recipient_id);
  if (client) {
    const notification: NotificationPacket = {
      type: "notification",
      data: {
        id: notif.id,
        type: "message",
        username: "",
        sender_id: currPacket.data.sender_id,
        recipient_id: currPacket.data.recipient_id,
        message: currPacket.data.message!,
        unreadCount: 1,
        createdAt: notif.updatedAt,
      },
    };
    client.send(JSON.stringify(notification));
  }
}

function checkNotificationMssg(currPacket: websocketPacket) {
  const updatedRow: rowInserted = app.db
    .prepare(
      "UPDATE notifications SET isRead = true, unreadCount = unreadCount + 1, updatedAt = (datetime('now')), message = ? WHERE sender_id = ? AND recipient_id = ? AND type = ?"
    )
    .run(currPacket.data.message, currPacket.data.sender_id, currPacket.data.recipient_id, "message");
  if (updatedRow.changes == 0) {
    createNotification(currPacket);
  } else {
    sendNotification(currPacket);
  }
}

function checkNotificationFriend(currPacket: websocketPacket) {
  const notif = app.db
    .prepare("SELECT * FROM notifications WHERE sender_id = ? AND recipient_id = ? AND type = ?")
    .get(currPacket.data.sender_id, currPacket.data.recipient_id, "friendReq");
  if (!notif) {
    createNotification(currPacket);
  }
}

function handleBlock(currPacket: websocketPacket) {
  console.log("outside");
  let client = clients.get(currPacket.data.recipient_id);
  if (client) {
    console.log("sending block to -> ", currPacket.data.recipient_id);
    client.send(JSON.stringify(currPacket));
  }
}

async function processMessages() {
  if (isProcessingQueue || messageQueue.length == 0) return;
  isProcessingQueue = true;
  while (messageQueue.length > 0) {
    const currPacket: websocketPacket | undefined = messageQueue.shift();
    if (!currPacket) return;
    console.log("Now handling packet => ", currPacket);
    try {
      if (currPacket.type == "chat") {
        if (currPacket.data.type == "message") {
          const savedMessage: rowInserted = app.db
            .prepare("INSERT INTO messages(sender_id, recipient_id, message) VALUES (?, ?, ?)")
            .run(currPacket.data.sender_id, currPacket.data.recipient_id, currPacket.data.message);
          currPacket.data.id = savedMessage.lastInsertRowid;
          currPacket.data.isDelivered = true;
          currPacket.data.type = "message";
          let client = clients.get(currPacket.data.recipient_id);
          if (client) client.send(JSON.stringify(currPacket));
          if (currPacket.data.sender_id) {
            client = clients.get(currPacket.data.sender_id);
            currPacket.data.type = "markDelivered";
            if (client) client.send(JSON.stringify(currPacket));
            currPacket.data.type = "message";
          }
          checkNotificationMssg(currPacket);
        } else if (currPacket.data.type == "markSeen") {
          app.db
            .prepare("UPDATE messages SET isRead = true WHERE id = ? AND sender_id = ? AND recipient_id = ?")
            .run(currPacket.data.id, currPacket.data.recipient_id, currPacket.data.sender_id);
          let client = clients.get(currPacket.data.recipient_id);
          if (client) client.send(JSON.stringify(currPacket));
        } else if (currPacket.data.type == "block") handleBlock(currPacket);
      } else if (currPacket.type == "notification") {
        if (currPacket.data.type == "markSeen") {
          app.db
            .prepare("UPDATE notifications SET isRead = true, unreadCount = 0 WHERE sender_id = ? AND recipient_id = ? AND type = ?")
            .run(currPacket.data.recipient_id, currPacket.data.sender_id, "message");
          let client = clients.get(currPacket.data.sender_id);
          if (client) client.send(JSON.stringify(currPacket));
        } else if (currPacket.data.type == "friendReq") {
          checkNotificationFriend(currPacket);
        } else if (currPacket.data.type == "friendAccept") {
          createNotification(currPacket);
        }
      }
    } catch (error) {
      console.log("Error in =>", currPacket);
      console.error("error writing in db -> ", error);
    }
  }
  isProcessingQueue = false;
}

function checkValidPacket(packet: websocketPacket, userId: number): boolean {
  if (packet.data.sender_id != userId || packet.data.sender_id == packet.data.recipient_id) return false;
  const checkFriend = app.db
    .prepare("SELECT key FROM json_each((SELECT friends FROM players WHERE id = ?)) WHERE value = ?")
    .get(userId.toString(), packet.data.recipient_id.toString());
  const checkSenderBlock = app.db
    .prepare("SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?")
    .get(userId.toString(), packet.data.recipient_id.toString());
  const checkRecipientBlock = app.db
    .prepare("SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?")
    .get(packet.data.recipient_id.toString(), userId.toString());
  if (
    (!checkFriend && packet.data.type != "friendReq" && packet.data.type != "friendAccept") || // send friendReq packet if not friend
    (checkFriend && packet.data.type == "friendReq") || // drop friendReq packet if already friend
    ((checkSenderBlock || checkRecipientBlock) && packet.data.type != "block") // let block/unblock packet even if blocked
  )
    return false;
  return true;
}

export const chatService = {
  websocket: true,
  handler: (connection: WebSocket, req: FastifyRequest, res: FastifyReply) => {
    const token = req.cookies.accessToken!;
    try {
      var payload = app.jwt.jwt1.verify(token) as Payload;
    } catch (error) {
      res.status(401).send({ error: "JWT_EXPIRED" });
      connection.close();
      return;
    }
    const userId = payload.id;
    const pingInterval = setInterval(() => {
      if (connection.readyState == connection.OPEN) connection.ping();
    }, 30000);
    clients.set(userId, connection);
    console.log("Connection Done with => " + payload.username);
    connection.on("message", (message: Buffer) => {
      try {
        const msgPacket: websocketPacket = JSON.parse(message.toString());
        if (checkValidPacket(msgPacket, userId) == false) {
          console.log("packet dropped -> ", msgPacket);
          return;
        }
        setImmediate(processMessages);
        messageQueue.push(msgPacket);
      } catch (e) {
        console.error("Error -> ", e);
      }
    });

    connection.on("close", () => {
      console.log("Client disconnected -> " + payload.username);
      clearInterval(pingInterval);
      clients.delete(userId);
    });
  },
};
