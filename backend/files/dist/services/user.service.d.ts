import type { FastifyReply, FastifyRequest } from "fastify";
export declare const fetchUser: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
export declare const fetchProfileUser: (req: FastifyRequest<{
    Params: {
        username?: string;
    };
}>, res: FastifyReply) => Promise<undefined>;
export declare const checkBlock: (req: FastifyRequest<{
    Params: {
        username?: string;
    };
}>, res: FastifyReply) => Promise<undefined>;
export declare const checkUserLoginPageStatus: (req: FastifyRequest, res: FastifyReply) => Promise<undefined>;
export declare const checkUserLoginStatus: (req: FastifyRequest, res: FastifyReply) => Promise<undefined>;
export declare const checkUser2faStatus: (req: FastifyRequest, res: FastifyReply) => Promise<undefined>;
export declare const uploadProfilePicture: (req: FastifyRequest, res: FastifyReply) => Promise<never>;
export declare const getUserInfo: (req: FastifyRequest<{
    Params: {
        id: string;
    };
}>, res: FastifyReply) => Promise<undefined>;
//# sourceMappingURL=user.service.d.ts.map