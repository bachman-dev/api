import { type Route, routes } from "@bachman-dev/api-types";
import collectSetRoutes from "./util/collectSetRoutes.js";
import { fastify } from "fastify";
import validateRoutes from "./util/validateRoutes.js";

const app = fastify();

const setRoutes: Route[] = [];

void app.register(import("./v1/discord.js"));

app.addHook("onRoute", (routeOptions) => {
  collectSetRoutes(routeOptions, routes, setRoutes);
});

app.addHook("onReady", () => {
  validateRoutes(routes, setRoutes);
});

try {
  await app.listen({ port: 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
