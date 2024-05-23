import { fastify } from "fastify";

const app = fastify();

try {
  await app.listen({ port: 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
