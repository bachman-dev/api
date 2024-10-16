import { type ApiResponseBody, HttpStatusCode } from "@bachman-dev/api-types";
import type { Env } from "../types/cloudflare.js";
import { Hono } from "hono";
import { apiV0Data } from "../v0/index.js";
import { apiV1Data } from "../v1/index.js";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (context) => {
  const versions = [apiV0Data, apiV1Data];
  const response = {
    success: true,
    data: {
      versions,
    },
    followUpUris: versions.map((version) => {
      return {
        method: "GET",
        uri: `/${version.version}`,
        description: `Get information about the ${version.version} API version`,
      };
    }),
  } satisfies ApiResponseBody<"GET /versions">;
  return context.json(response, HttpStatusCode.Ok);
});

export default app;
