import { type FastifyPluginAsync } from "fastify";
import app from "../server.js";
import { chatService } from "../services/chat.service.js";
import { getUsers } from "../services/getUsers.service.js";
import { getMessages } from "../services/getMessages.service.js";

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/send-message",
    { websocket: true, onRequest: [app.jwtAuth] },
    chatService.handler
  );
  fastify.get("/users", { onRequest: [app.jwtAuth] }, getUsers);
  fastify.get("/messages/:user", { onRequest: [app.jwtAuth] }, getMessages);
};
