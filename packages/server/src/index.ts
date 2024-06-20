import { type Route, routes } from "@bachman-dev/api-types";
import calVersionConstraint from "./util/calVersionConstraint.js";
import collectSetRoutes from "./util/collectSetRoutes.js";
import { fastify } from "fastify";
import loadSecrets from "./util/loadSecrets.js";
/* TODO: Create versioned routes using this as the config
import routeVersion from "./util/routeVersion.js";
*/
import validateRoutes from "./util/validateRoutes.js";

await loadSecrets();

const app = fastify({
  constraints: {
    version: calVersionConstraint,
  },
});

const setRoutes: Route[] = [];

/*
TODO: Implement Routes
void app.register(import("./v1/discord.js"));
*/

app.addHook("onRoute", (routeOptions) => {
  collectSetRoutes(routeOptions, routes, setRoutes);
});

app.addHook("onReady", () => {
  validateRoutes(routes, setRoutes);
});

try {
  await app.listen({ port: 3000, listenTextResolver: (address) => `Listening on ${address}` });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
