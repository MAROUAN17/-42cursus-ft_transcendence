import { type FastifyPluginAsync } from "fastify";
import app from "../server.js";
import { getNotifications } from "../services/getNotifications.service.js";
import { deleteNotification } from "../services/deleteNotification.service.js";
import { blockUser } from "../services/blockUser.service.js";

export const homeRoutes: FastifyPluginAsync = async (fastify) => {
  app.get("/notifications", { onRequest: [app.jwtAuth] }, getNotifications);
  app.delete("/notifications/:id", { onRequest: [app.jwtAuth] }, deleteNotification);
  app.post("/block/:id", { onRequest: [app.jwtAuth] }, blockUser);
};
