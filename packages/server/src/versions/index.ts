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
    followUpUris: [
      {
        method: "GET",
        uri: "/:version",
        description: "Get information about a specific API Version",
        params: {
          version: {
            type: ["string"],
            description: "The name of the API Version to get",
            values: versions.map((version) => version.name),
            required: true,
          },
        },
        response: {
          version: {
            type: ["object"],
            description: "Information about the Version",
            required: true,
          },
          "version.name": {
            type: ["string"],
            description: "The name of the API Version",
            required: true,
          },
          "version.description": {
            type: ["string"],
            description: "Description of the API Version",
            required: true,
          },
          "version.status": {
            type: ["string"],
            description: "The status of the API Version",
            values: ["active", "deprecated", "removed"],
            required: true,
          },
          "version.deprecationDate": {
            type: ["string"],
            description: `The date that the API Version was deprecated; only present on "deprecated" and "removed" API Version`,
          },
          "version.removalDate": {
            type: ["string"],
            description: `The date that the API Version was removed; only present on "removed" API Version`,
          },
        },
      },
    ],
  } satisfies ApiResponseBody<"GET /versions">;
  return context.json(response, HttpStatusCode.Ok);
});

export default app;
