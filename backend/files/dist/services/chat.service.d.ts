import { WebSocket } from "ws";
import type { FastifyReply, FastifyRequest } from "fastify";
export declare const chatService: {
    websocket: boolean;
    handler: (connection: WebSocket, req: FastifyRequest, res: FastifyReply) => void;
};
//# sourceMappingURL=chat.service.d.ts.map