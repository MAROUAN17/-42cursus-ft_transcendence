import { type FastifyPluginAsync } from "fastify";
import app from "../server.js";
import { chatService } from "../services/chat.service.js";
import { getUsers } from "../services/getUsers.service.js";
import { getMessages } from "../services/getMessages.service.js";
import { getUsersMessages } from "../services/getUsersMessages.service.js";

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
  app.get(
    "/send-message",
    { websocket: true, onRequest: [app.jwtAuth] },
    chatService.handler
  );
  app.get("/users", { onRequest: [app.jwtAuth] }, getUsersMessages);
  app.get("/messages/:user", { onRequest: [app.jwtAuth] }, getMessages);
};
