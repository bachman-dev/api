import { type ApiSuccessfulResponseBody, HttpStatusCode, apiGetV1TwitchSessionParams } from "@bachman-dev/api-types";
import type { Env } from "../types/cloudflare.js";
import { Hono } from "hono";
import { getDrizzle } from "../db/index.js";
import { throwOnValidationError } from "../errors.js";
import { zValidator } from "@hono/zod-validator";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (context) => {
  const response = {
    success: true,
    data: {
      message:
        "The Twitch OAuth Session API allows for non-web apps to get a Twitch API Access Token for an authenticated user asynchronously. A Session is created by the app using a unique V4 UUID, the app redirects the user to the provided redirect URL, and if they authorize the app, the access token can be retrieved using the session ID known by the app",
    },
    followUpUris: [
      {
        method: "POST",
        uri: "/v1/twitch/session",
        description: "Start a new Twitch OAuth Session",
      },
      {
        method: "GET",
        uri: "/v1/twitch/session/:id",
        description: "Get an existing Twitch OAuth Session",
      },
    ],
  } satisfies ApiSuccessfulResponseBody<"GET /v1/twitch">;
  return context.json(response, HttpStatusCode.Ok);
});

app.get("/session/:id", zValidator("param", apiGetV1TwitchSessionParams, throwOnValidationError), async (context) => {
  const drizzle = getDrizzle(context.env.DB);
  const { id } = context.req.valid("param");
  const twitchSession = await drizzle.query.twitchClientSessions.findFirst({
    with: {
      client: true,
    },
    where: (session, { eq }) => eq(session.id, id),
  });
  if (typeof twitchSession === "undefined") {
    return await context.notFound();
  }
  switch (twitchSession.status) {
    case "pending": {
      const response = {
        success: true,
        data: {
          session: {
            id: twitchSession.id,
            clientId: twitchSession.clientId,
            redirectUri: twitchSession.redirectUri,
            scopes: twitchSession.scopes.split(" "),
            status: "pending",
            loginUrl: twitchSession.loginUrl,
            expires: twitchSession.expires.toISOString(),
          },
        },
        followUpUris: [],
      } satisfies ApiSuccessfulResponseBody<"GET /v1/twitch/session/:id">;
      return context.json(response, HttpStatusCode.Ok);
    }
    case "canceled": {
      const response: ApiSuccessfulResponseBody<"GET /v1/twitch/session/:id"> = {
        success: true,
        data: {
          session: {
            id: twitchSession.id,
            clientId: twitchSession.clientId,
            redirectUri: twitchSession.redirectUri,
            scopes: twitchSession.scopes.split(" "),
            status: "canceled",
            expires: twitchSession.expires.toISOString(),
          },
        },
        followUpUris: [],
      };
      if (twitchSession.cancelReason !== null && response.data.session.status === "canceled") {
        response.data.session.reason = twitchSession.cancelReason;
      }
      return context.json(response, HttpStatusCode.Ok);
    }
    case "complete": {
      const response: ApiSuccessfulResponseBody<"GET /v1/twitch/session/:id"> = {
        success: true,
        data: {
          session: {
            id: twitchSession.id,
            clientId: twitchSession.clientId,
            redirectUri: twitchSession.redirectUri,
            scopes: twitchSession.scopes.split(" "),
            status: "complete",
            expires: twitchSession.expires.toISOString(),
            oauth: null,
          },
        },
        followUpUris: [],
      };
      if (twitchSession.cancelReason !== null && response.data.session.status === "canceled") {
        response.data.session.reason = twitchSession.cancelReason;
      }
      return context.json(response, HttpStatusCode.Ok);
    }
  }
});

export default app;
