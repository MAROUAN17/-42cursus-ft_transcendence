import fastify from "fastify";
import app from "../server.js";
import { WebSocket } from "ws";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { RequestQuery, Payload, messagePacket } from "../models/chat.js";
import type {
  ChatPacket,
  EventPacket,
  LogPacket,
  NotificationPacket,
  notificationPacket,
  notificationPacketDB,
  websocketPacket,
} from "../models/webSocket.model.js";

const clients = new Map<number, Set<WebSocket>>();
const messageQueue: websocketPacket[] = [];
let isProcessingQueue: boolean = false;

interface rowInserted {
  changes: number;
  lastInsertRowid: number;
}

function sendToClient(clientSockets: Set<WebSocket>, packet: websocketPacket) {
  for (const socket of clientSockets) {
    socket.send(JSON.stringify(packet));
  }
}

function createNotification(currPacket: websocketPacket) {
  if (currPacket.type == "onlineStatus" || currPacket.type == "logNotif" || currPacket.type == "gameEvent") return;
  const savedNotification: rowInserted = app.db
    .prepare("INSERT INTO notifications(type, sender_id, recipient_id,message) VALUES (?, ?, ?, ?)")
    .run(currPacket.data.type, currPacket.data.sender_id, currPacket.data.recipient_id, currPacket.data.message);
  const senderInfo = app.db.prepare("SELECT username, avatar FROM players WHERE id = ?").get(currPacket.data.sender_id);

  let client = clients.get(currPacket.data.recipient_id);
  if (client) {
    if (
      currPacket.data.type != "message" &&
      currPacket.data.type != "markSeen" &&
      currPacket.data.type != "friendReq" &&
      currPacket.data.type != "friendAccept"
    )
      return;
    const notification: NotificationPacket = {
      type: "notification",
      data: {
        id: savedNotification.lastInsertRowid,
        type: currPacket.data.type,
        username: senderInfo.username,
        avatar: senderInfo.avatar,
        sender_id: currPacket.data.sender_id,
        recipient_id: currPacket.data.recipient_id,
        message: currPacket.data.message!,
        unreadCount: 1,
        createdAt: currPacket.data.createdAt,
      },
    };
    sendToClient(client, notification);
  }
}

function sendNotification(currPacket: websocketPacket) {
  if (currPacket.type == "onlineStatus" || currPacket.type == "logNotif" || currPacket.type == "gameEvent") return;
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
        avatar: "",
        sender_id: currPacket.data.sender_id,
        recipient_id: currPacket.data.recipient_id,
        message: currPacket.data.message!,
        unreadCount: 1,
        createdAt: notif.updatedAt,
      },
    };
    sendToClient(client, notification);
  }
}

function checkNotificationMssg(currPacket: websocketPacket) {
  if (currPacket.type == "onlineStatus" || currPacket.type == "logNotif" || currPacket.type == "gameEvent") return;
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
  if (currPacket.type == "onlineStatus" || currPacket.type == "logNotif" || currPacket.type == "gameEvent") return;
  const notif = app.db
    .prepare("SELECT * FROM notifications WHERE sender_id = ? AND recipient_id = ? AND type = ?")
    .get(currPacket.data.sender_id, currPacket.data.recipient_id, "friendReq");
  if (!notif) {
    createNotification(currPacket);
  }
}

function handleBlock(currPacket: websocketPacket) {
  if (currPacket.type == "onlineStatus" || currPacket.type == "logNotif" || currPacket.type == "gameEvent") return;
  let client = clients.get(currPacket.data.recipient_id);
  if (client) {
    sendToClient(client, currPacket);
  }
}

function handleMessage(currPacket: ChatPacket) {
  const updatedRow: rowInserted = app.db
    .prepare(
      "UPDATE notifications SET isRead = true, unreadCount = unreadCount + 1, updatedAt = (datetime('now')), message = ? WHERE sender_id = ? AND recipient_id = ? AND type = ?"
    )
    .run(currPacket.data.message, currPacket.data.sender_id, currPacket.data.recipient_id, "message");
  const savedMessage: rowInserted = app.db
    .prepare("INSERT INTO messages(sender_id, recipient_id, message) VALUES (?, ?, ?)")
    .run(currPacket.data.sender_id, currPacket.data.recipient_id, currPacket.data.message);
  currPacket.data.id = savedMessage.lastInsertRowid;
  currPacket.data.isDelivered = true;
  currPacket.data.type = "message";
  let client = clients.get(currPacket.data.recipient_id);
  if (client) sendToClient(client, currPacket);
  if (currPacket.data.sender_id) {
    client = clients.get(currPacket.data.sender_id);
    currPacket.data.type = "markDelivered";
    if (client) sendToClient(client, currPacket);
    currPacket.data.type = "message";
  }
  checkNotificationMssg(currPacket);
}

function handleMsgMarkSeen(currPacket: ChatPacket) {
  app.db
    .prepare("UPDATE messages SET isRead = true WHERE id = ? AND sender_id = ? AND recipient_id = ?")
    .run(currPacket.data.id, currPacket.data.recipient_id, currPacket.data.sender_id);
  let client = clients.get(currPacket.data.recipient_id);
  if (client) sendToClient(client, currPacket);
}

function handleNotifMarkSeen(currPacket: NotificationPacket) {
  app.db
    .prepare("UPDATE notifications SET isRead = true, unreadCount = 0 WHERE sender_id = ? AND recipient_id = ? AND type = ?")
    .run(currPacket.data.recipient_id, currPacket.data.sender_id, "message");
  let client = clients.get(currPacket.data.sender_id);
  if (client) sendToClient(client, currPacket);
}

// function broadcastToAll(packet: websocketPacket) {}

function handleLogNotif(packet: LogPacket) {
  if (packet.data.game_type == "tournament") {
    const tournament = app.db.prepare("SELECT name FROM tournament WHERE id = ?").get(packet.data.tournament_id);
    if (!tournament) return;
    packet.data.tournament_name = tournament.name;
  }
  for (const userId of clients) {
    console.log("sending to -> ", userId[0]);
    const client = clients.get(Number(userId[0]));
    if (client) sendToClient(client, packet);
  }
}

function handleGameInvite(packet: ChatPacket) {
  const checkInvite: rowInserted = app.db
    .prepare("SELECT id FROM messages WHERE sender_id = ? AND recipient_id = ? AND type = ?")
    .get(packet.data.sender_id, packet.data.recipient_id, "gameInvite");
  // if (checkInvite) return;
  const savedMessage: rowInserted = app.db
    .prepare("INSERT INTO messages(sender_id, recipient_id, message, type) VALUES (?, ?, ?, ?)")
    .run(packet.data.sender_id, packet.data.recipient_id, packet.data.message, "gameInvite");
  packet.data.id = savedMessage.lastInsertRowid;
  packet.data.isDelivered = true;
  packet.data.type = "gameInvite";
  let client = clients.get(packet.data.recipient_id);
  if (client) sendToClient(client, packet);
  if (packet.data.sender_id) {
    client = clients.get(packet.data.sender_id);
    packet.data.type = "markDelivered";
    if (client) sendToClient(client, packet);
    packet.data.type = "message";
  }
  checkNotificationMssg(packet);
}

function handleGameInviteRes(packet: ChatPacket) {
  const checkInvite = app.db.prepare("SELECT id FROM messages WHERE id = ? AND type = ?").get(packet.data.id, "gameInvite");
  if (!checkInvite) return;
  const updatedMessage = app.db
    .prepare("UPDATE messages SET type = ?, message = ? WHERE id = ?")
    .run(packet.data.type, packet.data.message, checkInvite.id);
  let client = clients.get(packet.data.recipient_id);
  if (client) {
    sendToClient(client, packet);
    if (packet.data.type == "inviteAccepted") {
      const user = app.db.prepare("SELECT username FROM players WHERE id = ?").get(packet.data.recipient_id);
      if (!user) return;
      const notification: NotificationPacket = {
        type: "notification",
        data: {
          id: 0,
          type: "gameAlert",
          username: user.username,
          avatar: "",
          sender_id: packet.data.sender_id,
          recipient_id: packet.data.recipient_id,
          unreadCount: 0,
          createdAt: "",
        },
      };
      sendToClient(client, notification);
    }
  }
  client = clients.get(packet.data.sender_id);
  if (client) {
    sendToClient(client, packet);
  }
  checkNotificationMssg(packet);
}

function notifyTournament(packet: EventPacket) {
  const tournament = app.db.prepare("SELECT players, name FROM tournament WHERE id = ?").get(packet.data.tournamentId);
  if (packet.data.round == 1) {
    const players: number[] = JSON.parse(tournament.players);
    const alert: EventPacket = {
      type: "gameEvent",
      data: {
        tournamentId: packet.data.tournamentId,
        admin: packet.data.admin,
        round: 1,
        tournamentName: tournament.name,
      },
    };
    for (const playerId of players) {
      console.log("sending to -> ", playerId);
      let client = clients.get(Number(playerId));
      if (client) {
        sendToClient(client, alert);
      }
    }
  } else {
    const round = app.db.prepare("SELECT player1, player2 FROM round WHERE tournament_id = ? AND round_number = ?").get(packet.data.tournamentId, 2);
    console.log("final round -> ", round);
    if (!round) return;
    const alert: EventPacket = {
      type: "gameEvent",
      data: {
        tournamentId: packet.data.tournamentId,
        admin: packet.data.admin,
        round: 2,
        tournamentName: tournament.name,
      },
    };
    if (packet.data.senderId != round.player1) {
      let client = clients.get(round.player1);
      if (client) {
        sendToClient(client, alert);
      }
    } else {
      let client = clients.get(round.player2);
      if (client) {
        sendToClient(client, alert);
      }
    }
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
        if (currPacket.data.type == "message") handleMessage(currPacket);
        else if (currPacket.data.type == "markSeen") handleMsgMarkSeen(currPacket);
        else if (currPacket.data.type == "block") handleBlock(currPacket);
        else if (currPacket.data.type == "gameInvite") handleGameInvite(currPacket);
        else if (currPacket.data.type == "inviteAccepted" || currPacket.data.type == "inviteDeclined") handleGameInviteRes(currPacket);
      } else if (currPacket.type == "notification") {
        if (currPacket.data.type == "markSeen") handleNotifMarkSeen(currPacket);
        else if (currPacket.data.type == "friendReq") checkNotificationFriend(currPacket);
        else if (currPacket.data.type == "friendAccept") createNotification(currPacket);
      } else if (currPacket.type == "logNotif") handleLogNotif(currPacket);
      else if (currPacket.type == "gameEvent") notifyTournament(currPacket);
    } catch (error) {
      console.error("error writing in db -> ", error);
    }
  }
  isProcessingQueue = false;
}

function checkValidPacket(packet: websocketPacket, userId: number): boolean {
  if (packet.type == "onlineStatus" || (packet.type == "chat" && packet.data.message.length > 1000)) return false;
  else if (packet.type == "logNotif") return true;
  else if (packet.type == "gameEvent") {
    const checkAdmin = app.db.prepare("SELECT admin, status, players FROM tournament WHERE id = ?").get(packet.data.tournamentId);
    if (!checkAdmin || checkAdmin.status != "ongoing" || JSON.parse(checkAdmin.players).length != 4) return false;
    return true;
  }
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
    (!checkFriend && packet.data.type != "friendReq" && packet.data.type != "friendAccept" && packet.data.type != "block") || // send friendReq packet if not friend
    (checkFriend && packet.data.type == "friendReq") || // drop friendReq packet if already friend
    ((checkSenderBlock || checkRecipientBlock) && packet.data.type != "block") // let block/unblock packet even if blocked
  )
    return false;
  return true;
}

// function checkOnlineFriends(userId: number) {
//   const friendsDB: string = app.db.prepare("SELECT friends FROM players WHERE id = ?").get(userId).friends;
//   if (!friendsDB) return;
//   const friends: string[] = JSON.parse(friendsDB);
//   const packet: websocketPacket = {
//     type: "onlineStatus",
//     data: {
//       type: "friendsList",
//       friend_id: userId,
//       online: true,
//     },
//   };
//   let onlineFriends: number[] = [];
//   for (const friendId of friends) {
//     const client = clients.get(Number(friendId));
//     if (client) onlineFriends.push(Number(friendId));
//   }
//   packet.data.friends_list = onlineFriends;
//   const client = clients.get(userId);
//   if (client) {
//     sendToClient(client, packet);
//   }
// }
function broadcastToFriends(userId: number, status: boolean) {
  const friendsDB: string = app.db.prepare("SELECT friends FROM players WHERE id = ?").get(userId).friends;
  if (!friendsDB) return;
  const friends: string[] = JSON.parse(friendsDB);
  const packet: websocketPacket = {
    type: "onlineStatus",
    data: {
      type: "singleFriend",
      friend_id: userId,
      online: status,
    },
  };
  try {
    app.db.prepare("UPDATE players SET online = ? WHERE id = ?").run(status ? 1 : 0, userId);
  } catch (error) {
    console.log("sql error -> ", error);
  }
  for (const friendId of friends) {
    const client = clients.get(Number(friendId));
    if (client) sendToClient(client, packet);
  }
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
    if (clients.has(userId)) clients.get(userId)!.add(connection);
    else clients.set(userId, new Set<WebSocket>());
    // checkOnlineFriends(userId);
    broadcastToFriends(userId, true);
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
      broadcastToFriends(userId, false);
      clients.get(userId)?.delete(connection);
      clearInterval(pingInterval);
      if (clients.get(userId)?.size == 0) clients.delete(userId);
    });
  },
};
