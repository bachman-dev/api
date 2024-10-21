import { type ApiResponseBody, type ApiVersionData, HttpStatusCode } from "@bachman-dev/api-types";
import type { Env } from "../types/cloudflare.js";
import { Hono } from "hono";

export const apiV0Data: ApiVersionData = {
  name: "v0",
  description: "Unstable, bleeding edge, and any endpoints with external data type definitions",
  status: "active",
} as const;

const app = new Hono<{ Bindings: Env }>();

app.get("/", (context) => {
  const response = {
    success: true,
    data: {
      version: apiV0Data,
    },
    followUpUris: [],
  } satisfies ApiResponseBody<"GET /:version">;
  return context.json(response, HttpStatusCode.Ok);
});

export default app;
