import {} from "fastify";
export const tournamentRoutes = async (fastify) => {
    fastify.get("/tournaments", async (request, reply) => {
        // Fetch tournaments from your database
        // reply.send(tournaments);
    });
    fastify.post("/tournaments", async (request, reply) => {
        // Create a new tournament
        // reply.send(newTournament);
    });
};
//# sourceMappingURL=tournament.routes.js.map