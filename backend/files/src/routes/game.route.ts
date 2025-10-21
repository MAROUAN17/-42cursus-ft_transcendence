import { type FastifyPluginAsync } from "fastify";
import { getData, handleGameConnection } from "../services/game.service.js";
import { 
  pair_players, 
  get_game, 
  get_queue_status, 
  leave_queue, 
  get_player_game, 
  invite_game
} from "../services/match.service.js";

import { create_tournament, delete_tournament,
            get_tournament_by_id, get_tournaments, 
            join_tournament, leave_tournament ,
            get_tournament_winner, get_rounds,
            start_tournament,
            start_games,
            get_final_round, } 
            from "../services/tournament.service.js";
import { get_profile, get_player_rooms, get_player_week_activity, get_leaderboard, get_leaderboard_dashboard } from "../services/states.service.js";
import app from "../server.js";

export const gameRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/game", { websocket: true }, handleGameConnection);
  
  fastify.post("/match/pair", { onRequest: [app.jwtAuth] }, pair_players);
  fastify.post("/match/invite", { onRequest: [app.jwtAuth] },invite_game);
  fastify.get("/match/queue-status",  { onRequest: [app.jwtAuth] },get_queue_status);
  fastify.delete("/match/leave-queue", { onRequest: [app.jwtAuth] },leave_queue);
  fastify.get("/match/game/:gameId", { onRequest: [app.jwtAuth] },get_game);

  fastify.get("/match/my-game/:playerId", { onRequest: [app.jwtAuth] },get_player_game);

  fastify.get("/game/rooms", { onRequest: [app.jwtAuth] },getData);

  fastify.post("/tournament/create", { onRequest: [app.jwtAuth] },create_tournament);
  fastify.post("/tournament/join", { onRequest: [app.jwtAuth] },join_tournament)
  fastify.get("/tournament/all", { onRequest: [app.jwtAuth] },get_tournaments);
  fastify.delete("/tournament/delete", { onRequest: [app.jwtAuth] },delete_tournament);
  fastify.post("/tournament/leave", { onRequest: [app.jwtAuth] },leave_tournament);
  fastify.get("/tournament/:tournamentId", { onRequest: [app.jwtAuth] },get_tournament_by_id);
  fastify.get("/tournament/rounds/:tournamentId", { onRequest: [app.jwtAuth] },get_rounds);
  fastify.post("/tournament/start/:tournamentId", { onRequest: [app.jwtAuth] },start_tournament);
  fastify.get("/tournament/winner/:tournamentId", { onRequest: [app.jwtAuth] },get_tournament_winner);
  fastify.get("/tournament/start_games/:tournamentId", { onRequest: [app.jwtAuth] },start_games);
  fastify.get("/tournament/final_round/:tournamentId", { onRequest: [app.jwtAuth] },get_final_round);

  //states
  fastify.get("/states/leaders", { onRequest: [app.jwtAuth] }, get_leaderboard);
  fastify.get("/states/dashboard/leaders", { onRequest: [app.jwtAuth] }, get_leaderboard_dashboard);
  fastify.get("/states/profile/:playerId", { onRequest: [app.jwtAuth] }, get_profile);
  fastify.get("/states/player-rooms/:playerId", { onRequest: [app.jwtAuth] }, get_player_rooms);
  fastify.get("/states/player-week-activity/:playerId", { onRequest: [app.jwtAuth] }, get_player_week_activity);
  fastify.get("/states/leaderboard/:playerId", { onRequest: [app.jwtAuth] }, get_leaderboard);

};