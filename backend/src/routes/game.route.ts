import { type FastifyPluginAsync } from "fastify";
import { getGameState, updateGameState } from "../services/game.service.js";

export const gameRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/game", async (_, reply) => {
    reply.send(getGameState());
  });
};
