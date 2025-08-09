import fastify from "fastify";
import dbConnection from "./auth/login.js";
export const server = fastify({ logger: true });
const PORT = 5000;

server.register(dbConnection);

server.get("/users", async(req, res) => {
    const rows = server.db.prepare('SELECT * FROM users').all();
    return rows;
})

server.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`)
})