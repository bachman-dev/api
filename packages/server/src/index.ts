import { type ApiErrorResponseBody, type ApiResponseBody, HttpStatusCode } from "@bachman-dev/api-types";
import type { Env } from "./types/cloudflare.js";
import { Hono } from "hono";
import everyMinute from "./scheduled/everyMinute.js";
import version0 from "./v0/index.js";
import version1 from "./v1/index.js";
import versions from "./versions/index.js";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (context) => {
  const response = {
    success: true,
    data: {
      message: `Welcome to the Bachman Dev API! Check the "followUpUris" field for good places to start.`,
    },
    followUpUris: [
      {
        method: "GET",
        uri: "/versions",
        description: "Get info about available API versions",
      },
    ],
  } satisfies ApiResponseBody<"GET /">;
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
  } satisfies ApiErrorResponseBody;
  return context.json(response, HttpStatusCode.NotFound);
});

app.onError((error, context) => {
  const response = {
    success: false,
    error: {
      type: "INTERNAL_SERVER_ERROR",
      message: "An error was encountered while handling the request; it's been logged, and we'll look into it ASAP",
    },
  } satisfies ApiErrorResponseBody;
  console.log(error);
  return context.json(response, HttpStatusCode.InternalServerError);
});

const scheduled: ExportedHandlerScheduledHandler<Env> = async (controller, env, context): Promise<void> => {
  await everyMinute(controller, env, context);
};

export default {
  fetch: app.fetch,
  scheduled,
} satisfies ExportedHandler<Env>;
