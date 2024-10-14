import { type ApiGetIndexResponse, HttpStatusCode } from "@bachman-dev/api-types";
import type { Env } from "./types/cloudflare.js";
import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (context) => {
  const response = {
    success: true,
    versions: [
      {
        version: `v1`,
        status: "active",
      },
    ],
  } satisfies ApiGetIndexResponse;
  return context.json(response, HttpStatusCode.Ok);
});

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;
