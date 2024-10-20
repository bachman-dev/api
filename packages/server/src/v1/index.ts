import { type ApiResponseBody, type ApiVersionData, HttpStatusCode } from "@bachman-dev/api-types";
import type { Env } from "../types/cloudflare.js";
import { Hono } from "hono";

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
        description: "Get information about the Twitch OAuth Sessions API endpoint",
        response: {
          message: {
            type: ["string"],
            description: "A description of the API",
            required: true,
          },
        },
      },
    ],
  } satisfies ApiResponseBody<"GET /:version">;
  return context.json(response, HttpStatusCode.Ok);
});

export default app;
