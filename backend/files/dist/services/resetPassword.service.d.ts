import type { FastifyRequest, FastifyReply } from "fastify";
import type { LoginBody } from "../models/user.model.js";
export declare const checkResetPass: (req: FastifyRequest<{
    Body: LoginBody;
}>, res: FastifyReply) => Promise<undefined>;
export declare const resetPassword: (req: FastifyRequest<{
    Body: LoginBody;
}>, res: FastifyReply) => Promise<never>;
export declare const verifyResetPin: (req: FastifyRequest<{
    Body: LoginBody;
}>, res: FastifyReply) => Promise<never>;
//# sourceMappingURL=resetPassword.service.d.ts.map