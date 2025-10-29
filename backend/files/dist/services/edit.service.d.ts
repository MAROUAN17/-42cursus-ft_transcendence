import type { FastifyReply, FastifyRequest } from "fastify";
import type { editUserInfosBody, setAvatarBody } from "../models/user.model.js";
export declare const editUserInfos: (req: FastifyRequest<{
    Body: editUserInfosBody;
}>, res: FastifyReply) => Promise<undefined>;
export declare const setAvatar: (req: FastifyRequest<{
    Body: setAvatarBody;
}>, res: FastifyReply) => Promise<undefined>;
//# sourceMappingURL=edit.service.d.ts.map