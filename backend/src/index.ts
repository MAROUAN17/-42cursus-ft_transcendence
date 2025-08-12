import fastify from "fastify";
import websocketPlugin from "@fastify/websocket";
import { v4 as uuidv4 } from "uuid";
import type { Socket } from "dgram";
import { json } from "stream/consumers";

const server = fastify({ logger: false });
const PORT = 5000;
await server.register(websocketPlugin);
const clients = new Map<string, websocketPlugin.WebSocket>();

interface messagePacket {
  to: string;
  message: string;
}

server.get("/send-message", { websocket: true }, (connection, req) => {
  // console.log("req => " + req.toString());
  const id: string = uuidv4();
  clients.set(id, connection);
  console.log("Connection Done with => " + id);
  broadcast("hey!");
  // for (let client of server.websocketServer.clients) {
  //   console.log("I'm client");
  // }
  connection.on("message", (message: any) => {
    console.log("received : " + message.toString() + " from : " + id);
    try {
      const msgPacket: messagePacket = JSON.parse(message);
      const clientId = clients.get(msgPacket.to);
      if (clientId) clientId.send(msgPacket.message);
    } catch (e) {
      console.error("Invalid message")
    }
  });
  connection.on("close", () => {
    console.log("Client disconnected -> " + id);
    clients.delete(id);
  });
});

server.get("/ping", async (req, res) => {
  res.send({ test: "hello" });
});

function broadcast(message: string) {
  console.log("================================");
  for (let client of clients) {
    console.log("client..." + client[0]);
  }
  console.log("================================");
}

server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
