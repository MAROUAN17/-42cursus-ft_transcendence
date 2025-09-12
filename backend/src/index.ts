import fastify from "fastify";
import websocketPlugin from "@fastify/websocket";
import { v4 as uuidv4 } from "uuid";

const server = fastify({ logger: false });
const PORT = 5000;
await server.register(websocketPlugin);
const clients = new Map<string, websocketPlugin.WebSocket>();

server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
