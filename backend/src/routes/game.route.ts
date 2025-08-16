import { type FastifyPluginAsync } from "fastify";
import websocketPlugin from "@fastify/websocket";
import { v4 as uuidv4 } from "uuid";
import type { GameInfo } from "../models/game.js";

const clients = new Map<string, websocketPlugin.WebSocket>();

interface MessagePacket {
  to: string;
  game_info: GameInfo;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 18;
const PADDLE_HEIGHT = 120;

export const gameRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(websocketPlugin);

  fastify.get("/game", { websocket: true }, (connection, req) => {
    const id: string = uuidv4();
    clients.set(id, connection);
    console.log("Connection established with =>", id);

    const msgPacket: MessagePacket = {
      to: "me",
      game_info: {
        ball: { x: 100, y: 100, velX: 100, velY: 100 },
        paddleLeft: {
          x: 24,
          y: (GAME_HEIGHT - PADDLE_HEIGHT) / 2,
          width: PADDLE_WIDTH,
          height: PADDLE_HEIGHT
        },
        paddleRight: {
          x: GAME_WIDTH - 24 - PADDLE_WIDTH,
          y: (GAME_HEIGHT - PADDLE_HEIGHT) / 2,
          width: PADDLE_WIDTH,
          height: PADDLE_HEIGHT
        },
        bounds: {
          width: GAME_WIDTH,
          height: GAME_HEIGHT
        },
        scoreLeft: 0,
        scoreRight: 0
      },
    };
    broadcast(msgPacket);

    connection.on("game_info", (message: any) => {
      console.log(`Received from ${id}:`, message.toString());
      try {
        const clientConn = clients.get(msgPacket.to);
        
        if (clientConn) clientConn.send(msgPacket.game_info);
      } catch (err) {
        console.error("Invalid game info packet:", err);
      }
    });

    connection.on("close", () => {
      console.log("Client disconnected ->", id);
      clients.delete(id);
    });
  });

  fastify.get("/ping", async (req, res) => {
    res.send({ test: "hello" });
  });

  function broadcast(message: MessagePacket) {
    console.log("Broadcasting to clients:");
    const jsonMessage = JSON.stringify(message);
    for (const [id, conn] of clients) {
        console.log("->", id);
        conn.send(jsonMessage);
    }
}

};
