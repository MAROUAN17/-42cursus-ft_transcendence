//this is the file where we start the server
import Fastify from "fastify";
import App from "./app.js";

const app = Fastify({
    logger: true
});

async function start(): Promise<void> {
  await app.register(App);

  await app.listen({
    host: 'localhost',
    port: process.env.PORT
  });
}

start().catch(err => {
  console.log(err);
  process.exit(1);
})

export default app;

