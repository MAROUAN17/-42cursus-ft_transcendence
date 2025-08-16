import fastify from "fastify";
import app from "../server.js";
import { WebSocket } from "ws";
import type { FastifyRequest } from "fastify";
import type { RequestQuery, Payload, messagePacket } from "../models/chat.js";

const clients = new Map<string, WebSocket>();
const messageQueue = new Map<string, messagePacket>();
// const messageQueue: messagePacket[] = [];
let isProcessingQueue: boolean = false;

async function processMessages() {
  if (isProcessingQueue || messageQueue.size == 0) return;
  isProcessingQueue = true;
  for (const [recipient, packet] of messageQueue) {
    const currMsg: messagePacket | undefined = packet;
    if (!currMsg) return;
    console.log("Now andling message => ", currMsg.message);
    try {
      if (currMsg.type == "message") {
        const savedMessage = app.db
          .prepare(
            "INSERT INTO messages(sender, recipient, message) VALUES (?, ?, ?)"
          )
          .run(currMsg.from, currMsg.to, currMsg.message);
        if (savedMessage.lastInsertRowid) {
          currMsg.id = savedMessage.lastInsertRowid;
          currMsg.isDelivered = true;
          currMsg.type = "message";
          let client = clients.get(recipient);
          if (client) client.send(JSON.stringify(currMsg));
          if (currMsg.from) {
            client = clients.get(currMsg.from);
            currMsg.type = "markDelivered";
            if (client) client.send(JSON.stringify(currMsg));
          }
          console.log("done sending!");
        }
      } else if (currMsg.type == "markSeen") {
        console.log("updating isRead for =>", currMsg.message);
        app.db
          .prepare(
            "UPDATE messages SET isRead = true WHERE id = ? AND sender = ? AND recipient = ?"
          )
          .run(currMsg.id, currMsg.from, currMsg.to);
        let client = clients.get(recipient);
        if (client) client.send(JSON.stringify(currMsg));
      }
    } catch (error) {
      console.error("error writing in db -> ", error);
    }
    messageQueue.delete(recipient);
  }
  isProcessingQueue = false;
}

export const chatService = {
  websocket: true,
  handler: (connection: WebSocket, req: FastifyRequest) => {
    let payload;
    const token = req.cookies.token;
    if (token) {
      try {
        payload = app.jwt.verify(token) as Payload;
      } catch (error) {
        console.log("closed connection bad jwt");
        connection.close();
        return;
      }
    } else {
      console.log("closed no token");
      connection.close();
      return;
    }
    const username = payload.username;

    clients.set(username, connection);
    console.log("Connection Done with => " + username);

    connection.on("message", (message: Buffer) => {
      try {
        const msgPacket: messagePacket = JSON.parse(message.toString());
        if (msgPacket.type == "message") msgPacket.from = username;
        else msgPacket.to = username;
        setImmediate(processMessages);
        let client;
        client = clients.get(msgPacket.to);
        if (msgPacket.type == "message") {
          messageQueue.set(msgPacket.to, msgPacket);
          client = clients.get(msgPacket.to);
        } else if (msgPacket.from) {
          console.log(
            "sending markSeen to => ",
            msgPacket,
            " to => ",
            msgPacket.from
          );
          // client = clients.get(msgPacket.to);
          messageQueue.set(msgPacket.to, msgPacket);
          // client = clients.get(msgPacket.from);
          messageQueue.set(msgPacket.from, msgPacket);
        }
        // if (msgPacket.from) messageQueue.set(msgPacket.from, msgPacket);
        // if (client) {
        //   client.send(JSON.stringify(msgPacket));
        // }
      } catch {
        console.error("Invalid message");
      }
    });

    connection.on("close", () => {
      console.log("Client disconnected -> " + username);
      clients.delete(username);
    });
  },
};
