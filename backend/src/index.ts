import fastify from "fastify";
import websocketPlugin from "@fastify/websocket";

const server = fastify({ logger: false });
const PORT = 5000;
await server.register(websocketPlugin);

server.get("/send-message", { websocket: true }, (connection, req) => {
  // console.log("req => " + req.toString());
  connection.on("message", (message: any) => {
    console.log("received : " + message.toString());
    connection.send("YOOOOOOO");
  });
  connection.on("close", () => {
    console.log("Client disconnected");
  });
});

server.get("/ping", async (req, res) => {
  res.send({ test: "hello" });
});

server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
