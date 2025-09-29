import { type FastifyPluginAsync } from "fastify";
import app from "../server.js";
import { getNotifications } from "../services/getNotifications.service.js";
import { deleteNotification } from "../services/deleteNotification.service.js";
import { blockUser } from "../services/blockUser.service.js";
import { unblockUser } from "../services/unblockUser.service.js";
import { deleteAccount } from "../services/deleteAccount.service.js";
import { searchUsers } from "../services/searchUsers.service.js";

export const homeRoutes: FastifyPluginAsync = async (fastify) => {
  app.get("/notifications", { onRequest: [app.jwtAuth] }, getNotifications);
  app.get("/search", { onRequest: [app.jwtAuth] }, searchUsers);
  app.delete("/notifications/:id", { onRequest: [app.jwtAuth] }, deleteNotification);
  app.post("/block/:id", { onRequest: [app.jwtAuth] }, blockUser);
  app.post("/unblock/:id", { onRequest: [app.jwtAuth] }, unblockUser);
  app.delete("/deleteAccount", { onRequest: [app.jwtAuth] }, deleteAccount);
};
