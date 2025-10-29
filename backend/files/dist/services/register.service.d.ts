import type { FastifyReply, FastifyRequest } from "fastify";
interface registerBody {
    username: string;
    email: string;
    password: string;
    terms: boolean;
}
export declare const registerUser: (req: FastifyRequest<{
    Body: registerBody;
}>, res: FastifyReply) => Promise<undefined>;
export {};
//# sourceMappingURL=register.service.d.ts.map