import { type FastifyPluginAsync } from "fastify";
import websocketPlugin from "@fastify/websocket";
import { v4 as uuidv4 } from "uuid";
import type { GameInfo } from "../models/game.js";
import { getData, handleGameConnection } from "../services/game.service.js";
import { 
  pair_players, 
  get_game, 
  get_queue_status, 
  leave_queue, 
  get_player_game 
} from "../services/match.service.js";
import { create_tournament, delete_tournament, get_tournament_by_id, get_tournaments, join_tournament, leave_tournament } from "../services/tournament.service.js";

const clients = new Map<string, websocketPlugin.WebSocket>();

interface MessagePacket {
  to: string;
  game_info: GameInfo;
}

export const gameRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/game", { websocket: true }, handleGameConnection);
  
  fastify.post("/match/pair", pair_players);
  fastify.get("/match/queue-status",  get_queue_status);
  fastify.delete("/match/leave-queue", leave_queue);
  fastify.get("/match/game/:gameId", get_game);
  
  fastify.get("/match/my-game", get_player_game);

  fastify.get("/game/rooms", getData);

  fastify.post("/tournament/create", create_tournament);
  fastify.post("/tournament/join", join_tournament)
  fastify.get("/tournament/all", get_tournaments);
  fastify.delete("/tournament/delete", delete_tournament);
  fastify.delete("/tournament/leave", leave_tournament);
  fastify.get("/tournament/:tournamentId", get_tournament_by_id);

}