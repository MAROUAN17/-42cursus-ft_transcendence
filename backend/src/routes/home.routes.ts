import { type FastifyPluginAsync } from "fastify";
import app from "../server.js";
import { getNotifications } from "../services/getNotifications.service.js";
import { deleteNotification } from "../services/deleteNotification.service.js";

export const homeRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/notifications", { onRequest: [app.jwtAuth] }, getNotifications);
  fastify.delete("/notifications/:id", { onRequest: [app.jwtAuth] }, deleteNotification);
};
