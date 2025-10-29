import type { FastifyReply, FastifyRequest } from "fastify";
import type { gameCustomization } from "../models/game.js";
export declare const updateCustomization: (req: FastifyRequest<{
    Body: gameCustomization;
}>, res: FastifyReply) => Promise<void>;
export declare const getCustomization: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
//# sourceMappingURL=updateCustomization.service.d.ts.map