import fastify from "fastify";
import app from "../server.js";
import { WebSocket } from "ws";
import type { FastifyRequest } from "fastify";
import type { RequestQuery, Payload, messagePacket } from "../models/chat.js";

const clients = new Map<string, WebSocket>();
const messageQueue: messagePacket[] = [];
let isProcessingQueue: boolean = false;

async function processMessages() {
  if (isProcessingQueue || messageQueue.length == 0) return;
  isProcessingQueue = true;
  while (messageQueue.length > 0) {
    const currMsg: messagePacket | undefined = messageQueue.shift();
    if (!currMsg) return;
    try {
      app.db
        .prepare(
          "INSERT INTO messages(sender, recipient, message) VALUES (?, ?, ?)"
        )
        .run(currMsg.from, currMsg.to, currMsg.message);
    } catch (error) {
      console.error("error writing in db -> ", error);
    }
  }
  isProcessingQueue = false;
}

export const chatService = {
  websocket: true,
  handler: (connection: WebSocket, req: FastifyRequest) => {
    let payload;
    const token = req.cookies.token;
    // console.log("jwtToken => ", req.cookies.token);
    if (token) {
      // console.log('pre verified');
      try {
        payload = app.jwt.verify(token) as Payload;
      } catch (error) {
        console.log("closed connection bad jwt");
        connection.close();
        return;
      }
      // console.log('after verified => ', payload.username);
    } else {
      console.log("closed no token");
      connection.close();
      return;
    }
    const email = payload.email;

    clients.set(email, connection);
    console.log("Connection Done with => " + email);

    connection.on("message", (message: Buffer) => {
      console.log("received : " + message.toString() + " from : " + email);
      try {
        const msgPacket: messagePacket = JSON.parse(message.toString());
        msgPacket.from = email;
        messageQueue.push(msgPacket);
        setImmediate(processMessages);
        const client = clients.get(msgPacket.to);
        if (client) {
          client.send(JSON.stringify(msgPacket));
        }
      } catch {
        console.error("Invalid message");
      }
    });

    connection.on("close", () => {
      console.log("Client disconnected -> " + email);
      clients.delete(email);
    });
  },
};
