import { type ApiErrorResponse, type ApiGetIndexResponse, HttpStatusCode } from "@bachman-dev/api-types";
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

app.notFound((context) => {
  const response = {
    success: false,
    error: {
      type: "NOT_FOUND",
      message: `The requested reource at ${context.req.path} was not found`,
    },
  } satisfies ApiErrorResponse;
  return context.json(response);
});

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;
