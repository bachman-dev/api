import { type ApiErrorResponse, type ApiResponse, HttpStatusCode } from "@bachman-dev/api-types";
import type { Env } from "./types/cloudflare.js";
import { Hono } from "hono";
import version0 from "./v0/index.js";
import version1 from "./v1/index.js";
import versions from "./versions/index.js";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (context) => {
  const response = {
    success: true,
    data: {
      followUpUris: [
        {
          method: "GET",
          uri: "/versions",
          description: "Get info about available API versions",
        },
      ],
      message: `Welcome to the Bachman Dev API! Check the "followUpUris" field for good places to start.`,
    },
  } satisfies ApiResponse<"GET /">;
  return context.json(response, HttpStatusCode.Ok);
});

app.route("/versions", versions);
app.route("/v0", version0);
app.route("/v1", version1);

app.notFound((context) => {
  const response = {
    success: false,
    error: {
      type: "NOT_FOUND",
      message: `The requested reource at ${context.req.path} was not found`,
    },
  } satisfies ApiErrorResponse;
  return context.json(response, HttpStatusCode.NotFound);
});

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;
