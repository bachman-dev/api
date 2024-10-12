import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import type { Bindings } from "./types/cloudflare.js";
import { HttpStatusCode } from "@bachman-dev/api-types";

const route = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            greeting: z.string(),
          }),
        },
      },
      description: "Say hello to the user",
    },
  },
});

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.openapi(route, (context) =>
  context.json(
    {
      greeting: "Hello, world!",
    },
    HttpStatusCode.Ok,
  ),
);

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Bindings>;
