import contract from "@bachman-dev/api-contract";
import { fastify } from "fastify";
import { initServer } from "@ts-rest/fastify";

const app = fastify();

const tsr = initServer();

const router = tsr.router(contract, {
  sayHello: async () =>
    await Promise.resolve({
      status: 200,
      body: {
        greeting: "Hello, World!",
      },
    }),
});

await app.register(tsr.plugin(router));

try {
  await app.listen({ port: 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
