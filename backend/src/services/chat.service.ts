import fastify from "fastify";
import app from "../server.js";
import { WebSocket } from "ws";
import type { FastifyRequest } from "fastify";
import type { RequestQuery, Payload, messagePacket } from "../models/chat.js";

const clients = new Map<string, WebSocket>();

export const chatService = {
  websocket: true,
  handler: (connection: WebSocket, req: FastifyRequest) => {
    const token = (req.query as RequestQuery).token;
    const payload = app.jwt.verify(token) as Payload;
    const email = payload.email;

    clients.set(email, connection);
    console.log("Connection Done with => " + email);

    connection.on("message", (message: Buffer) => {
      console.log("received : " + message.toString() + " from : " + email);
      try {
        const msgPacket: messagePacket = JSON.parse(message.toString());
        const client = clients.get(msgPacket.to);
        if (client) client.send(msgPacket.message);
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
