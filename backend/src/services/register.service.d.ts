import { type LoginBody } from "../models/user.js";
import type { FastifyReply, FastifyRequest } from "fastify";
export declare const registerUser: (req: FastifyRequest<{
    Body: LoginBody;
}>, res: FastifyReply) => Promise<undefined>;
//# sourceMappingURL=register.service.d.ts.map