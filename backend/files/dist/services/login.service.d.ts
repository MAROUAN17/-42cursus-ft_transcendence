import { type LoginBody } from "../models/user.model.js";
import type { FastifyReply, FastifyRequest } from "fastify";
export declare const loginUser: (req: FastifyRequest<{
    Body: LoginBody;
}>, res: FastifyReply) => Promise<undefined>;
//# sourceMappingURL=login.service.d.ts.map