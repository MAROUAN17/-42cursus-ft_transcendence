import Fastify from "fastify";
import App from "./app.js";
const PORT = 5000;

const app = Fastify({
    logger: true
})

async function start(): Promise<void> {
  await app.register(App);

  await app.listen({
    host: 'localhost',
    port: PORT
  });
}

start().catch(err => {
  console.log(err);
  process.exit(1);
})

export default app;

