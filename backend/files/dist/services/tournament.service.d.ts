import type { FastifyReply, FastifyRequest } from "fastify";
export declare const start_games: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
export declare const create_tournament: (req: FastifyRequest, res: FastifyReply) => Promise<undefined>;
export declare const join_tournament: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
export declare const get_tournaments: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
export declare const get_tournament_by_id: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
export declare const delete_tournament: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
export declare const leave_tournament: (req: FastifyRequest, res: FastifyReply) => Promise<undefined>;
export declare const start_tournament: (req: FastifyRequest<{
    Body: {
        playerId: number;
    };
}>, res: FastifyReply) => Promise<never>;
export declare const get_rounds: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
export declare const get_score: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
export declare const report_match_result: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
export declare const get_tournament_winner: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
export declare const get_final_round: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
//# sourceMappingURL=tournament.service.d.ts.map