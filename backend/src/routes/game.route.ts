import { type FastifyPluginAsync } from "fastify";
import { getData, handleGameConnection } from "../services/game.service.js";
import { 
  pair_players, 
  get_game, 
  get_queue_status, 
  leave_queue, 
  get_player_game 
} from "../services/match.service.js";

import { create_tournament, delete_tournament,
            get_tournament_by_id, get_tournaments, 
            join_tournament, leave_tournament ,
            get_tournament_winner, get_rounds,
            start_tournament,
            start_games,
            get_final_round, } 
            from "../services/tournament.service.js";
import { get_profile, get_player_rooms, get_player_week_activity, get_leaderboard } from "../services/states.service.js";

export const gameRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/game", { websocket: true }, handleGameConnection);
  
  fastify.post("/match/pair", pair_players);
  fastify.get("/match/queue-status",  get_queue_status);
  fastify.delete("/match/leave-queue", leave_queue);
  fastify.get("/match/game/:gameId", get_game);

  fastify.get("/match/my-game/:playerId", get_player_game);

  fastify.get("/game/rooms", getData);

  fastify.post("/tournament/create", create_tournament);
  fastify.post("/tournament/join", join_tournament)
  fastify.get("/tournament/all", get_tournaments);
  fastify.delete("/tournament/delete", delete_tournament);
  fastify.delete("/tournament/leave", leave_tournament);
  fastify.get("/tournament/:tournamentId", get_tournament_by_id);
  fastify.get("/tournament/rounds/:tournamentId", get_rounds);
  fastify.post("/tournament/start/:tournamentId", start_tournament);
  fastify.get("/tournament/winner/:tournamentId", get_tournament_winner);
  fastify.get("/tournament/start_games/:tournamentId", start_games);
  fastify.get("/tournament/final_round/:tournamentId", get_final_round);

  //states
  fastify.get("/states/profile/:playerId", get_profile);
  fastify.get("/states/player-rooms/:playerId", get_player_rooms);
  fastify.get("/states/player-week-activity/:playerId", get_player_week_activity);
  fastify.get("/states/leaderboard/:playerId", get_leaderboard);

};