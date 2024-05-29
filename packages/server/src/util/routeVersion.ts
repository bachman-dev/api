import type { RouteShorthandOptions } from "fastify";

export default function routeVersion(version: string): RouteShorthandOptions {
  return {
    constraints: {
      version,
    },
    preHandler: (_req, reply, done): void => {
      void reply.header("x-api-version", version);
      done();
    },
  };
}
