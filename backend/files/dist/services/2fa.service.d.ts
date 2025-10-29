import type { FastifyRequest, FastifyReply } from "fastify";
import { type LoginBody } from "../models/user.model.js";
export declare const setup2FA: (req: FastifyRequest, res: FastifyReply) => Promise<string[]>;
export declare const deleteSetup2FA: (req: FastifyRequest, res: FastifyReply) => Promise<undefined>;
export declare const verifySetup2FA: (req: FastifyRequest<{
    Body: LoginBody;
}>, res: FastifyReply) => Promise<undefined>;
export declare const verify2FAToken: (req: FastifyRequest<{
    Body: LoginBody;
}>, res: FastifyReply) => Promise<undefined>;
//# sourceMappingURL=2fa.service.d.ts.map