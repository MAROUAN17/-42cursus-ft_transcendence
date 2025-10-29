import type { FastifyReply, FastifyRequest } from "fastify";
import { type GameInfo } from "../models/game.js";
import type { Game } from "../models/game.js";
export declare const activeGames: Game[];
export declare const delete_Match: (gameId: string) => void;
export declare const pair_players: (req: FastifyRequest, res: FastifyReply) => Promise<undefined>;
export declare const get_queue_status: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
export declare const leave_queue: (req: FastifyRequest, res: FastifyReply) => Promise<undefined>;
export declare const get_game: (req: FastifyRequest, res: FastifyReply) => Promise<undefined>;
export declare const get_player_game: (req: FastifyRequest, res: FastifyReply) => Promise<undefined>;
export declare const invite_game: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
export declare const updateGameForId: (gameId: string, updates: Partial<GameInfo>) => GameInfo | null;
export declare const getGameStateById: (gameId: string) => GameInfo | null;
//# sourceMappingURL=match.service.d.ts.map