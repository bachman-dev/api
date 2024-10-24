import { type ApiResponseBody, type ApiVersionData, HttpStatusCode } from "@bachman-dev/api-types";
import type { Env } from "../types/cloudflare.js";
import { Hono } from "hono";
import twitch from "./twitch.js";

export const apiV1Data: ApiVersionData = {
  name: "v1",
  description: "The latest stable version; requests/responses data types are defined within the API",
  status: "active",
} as const;

const app = new Hono<{ Bindings: Env }>();

app.get("/", (context) => {
  const response = {
    success: true,
    data: {
      version: apiV1Data,
    },
    followUpUris: [
      {
        method: "GET",
        uri: "/v1/twitch",
        description: "Get information about the Twitch PKCE OAuth API endpoint",
      },
    ],
  } satisfies ApiResponseBody<"GET /:version">;
  return context.json(response, HttpStatusCode.Ok);
});

app.route("/twitch", twitch);

export default app;
