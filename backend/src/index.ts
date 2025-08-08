import fastify from "fastify";
const server = fastify({ logger: true });
const PORT = 5000;

server.get("/ping", async(req, res) => {
    res.send({test:'hello'});
})

server.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`)
})