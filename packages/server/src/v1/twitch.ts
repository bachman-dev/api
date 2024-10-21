import {
  type ApiErrorResponseBody,
  type ApiSuccessfulResponseBody,
  HttpStatusCode,
  apiGetV1TwitchSessionParams,
  apiPostV1TwitchSessionBody,
  apiPostV1TwitchSessionHeaders,
} from "@bachman-dev/api-types";
import type { Env } from "../types/cloudflare.js";
import { Hono } from "hono";
import { getDrizzle } from "../db/index.js";
import { throwOnValidationError } from "../errors.js";
import { twitchClientSessions } from "../db/schema.js";
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

app.post(
  "/session",
  zValidator("header", apiPostV1TwitchSessionHeaders, throwOnValidationError),
  zValidator("json", apiPostV1TwitchSessionBody, throwOnValidationError),
  async (context) => {
    const json = context.req.valid("json");
    const drizzle = getDrizzle(context.env.DB);
    const twitchClient = await drizzle.query.twitchClients.findFirst({
      where: (twitchClient, { eq }) => eq(twitchClient.clientId, json.clientId),
    });
    if (typeof twitchClient === "undefined") {
      const response = {
        success: false,
        error: {
          type: "BAD_REQUEST",
          message: "The request contained invalid data",
          issues: [
            {
              path: "json: clientId",
              issue: "Client ID is not recognized",
            },
          ],
        },
      } satisfies ApiErrorResponseBody;
      return context.json(response, HttpStatusCode.BadRequest);
    }
    const twitchSession = await drizzle.query.twitchClientSessions.findFirst({
      where: (twitchClientSession, { eq }) => eq(twitchClientSession.id, json.sessionId),
    });
    if (typeof twitchSession !== "undefined") {
      const response = {
        success: false,
        error: {
          type: "BAD_REQUEST",
          message: "The request contained invalid data",
          issues: [
            {
              path: "json: sessionId",
              issue: "Session ID has already been used",
            },
          ],
        },
      } satisfies ApiErrorResponseBody;
      return context.json(response, HttpStatusCode.BadRequest);
    }
    const expires = new Date(Date.now());
    const loginUrl = `https://id.twitch.tv/oauth2/authorize
    ?response_type=code&force_verify=true&client_id=${json.clientId}&redirect_uri=${encodeURIComponent(json.redirectUri)}&scope=${encodeURIComponent(json.scopes.join(" "))}&state=${json.sessionId}`;
    await drizzle.insert(twitchClientSessions).values({
      clientId: json.clientId,
      id: json.sessionId,
      status: "pending",
      redirectUri: json.redirectUri,
      loginUrl,
      scopes: json.scopes.join(" "),
      expires,
    });
    const response = {
      success: true,
      data: {
        session: {
          id: json.sessionId,
          clientId: json.clientId,
          scopes: json.scopes,
          status: "pending",
          redirectUri: json.redirectUri,
          loginUrl,
          expires: expires.toISOString(),
        },
      },
      followUpUris: [
        {
          method: "GET",
          uri: `/v1/twitch/session/${json.sessionId}`,
          description: "Get information about the session and its current status",
        },
      ],
    } satisfies ApiSuccessfulResponseBody<"POST /v1/twitch/session">;
    return context.json(response, HttpStatusCode.Ok);
  },
);

export default app;
