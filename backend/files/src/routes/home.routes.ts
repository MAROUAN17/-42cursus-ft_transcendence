import { type FastifyPluginAsync } from "fastify";
import app from "../server.js";
import { getNotifications } from "../services/getNotifications.service.js";
import { deleteNotification } from "../services/deleteNotification.service.js";
import { blockUser } from "../services/blockUser.service.js";
import { unblockUser } from "../services/unblockUser.service.js";
import { deleteAccount } from "../services/deleteAccount.service.js";
import { searchUsers } from "../services/searchUsers.service.js";
import { getUserInfo } from "../services/user.service.js";
import { getPersonalData } from "../services/getPersonalData.service.js";
import { getCustomization, updateCustomization } from "../services/updateCustomization.service.js";

export const homeRoutes: FastifyPluginAsync = async (fastify) => {
  app.get("/notifications", { onRequest: [app.jwtAuth] }, getNotifications);
  app.get("/search", { onRequest: [app.jwtAuth] }, searchUsers);
  app.delete("/notifications/:id", { onRequest: [app.jwtAuth] }, deleteNotification);
  app.post("/block/:id", { onRequest: [app.jwtAuth] }, blockUser);
  app.post("/unblock/:id", { onRequest: [app.jwtAuth] }, unblockUser);
  app.get("/getPersonalData", { onRequest: [app.jwtAuth] }, getPersonalData);
  app.delete("/deleteAccount", { onRequest: [app.jwtAuth] }, deleteAccount);
  app.get("/user/:id", {  }, getUserInfo);
  app.post("/updateCustomization", { onRequest: [app.jwtAuth] }, updateCustomization);
  app.get("/getCustomization", { onRequest: [app.jwtAuth] }, getCustomization);
};
