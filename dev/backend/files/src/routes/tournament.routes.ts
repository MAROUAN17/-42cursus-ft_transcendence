import { type FastifyPluginAsync } from "fastify";

export const tournamentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/tournaments", async (request, reply) => {
    // Fetch tournaments from your database
    // reply.send(tournaments);
  });

  fastify.post("/tournaments", async (request, reply) => {
    // Create a new tournament
    // reply.send(newTournament);
  });
};