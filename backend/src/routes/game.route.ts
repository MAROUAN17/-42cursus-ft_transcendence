import { type FastifyPluginAsync } from "fastify";
import websocketPlugin from "@fastify/websocket";
import { v4 as uuidv4 } from "uuid";
import type { GameInfo } from "../models/game.js";
import { handleGameConnection } from "../services/game.service.js";

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

  fastify.get("/game", { websocket: true }, handleGameConnection)

};
