import { type ApiFollowUpUri, type ApiSuccessfulResponseBody, HttpStatusCode } from "@bachman-dev/api-types";
import type { Env } from "../types/cloudflare.js";
import { Hono } from "hono";

const commonTwitchSession = {
  session: {
    type: ["object"],
    description: "Information about the Twitch OAuth Session",
    required: true,
  },
  "session.id": {
    type: ["string"],
    description: "The ID of the Twitch OAuth Session",
    required: true,
  },
  "session.clientId": {
    type: ["string"],
    description: "The Twitch app Client ID associated with this Twitch OAuth Session",
    required: true,
  },
  "session.redirectUri": {
    type: ["string"],
    description: "The redirect URI that Twitch will send the Authorization Code to during the OAuth flow",
    required: true,
  },
  "session.scopes[]": {
    type: ["string"],
    description: "Which scopes to authorize the user for access",
    required: true,
  },
  "session.expires": {
    type: ["string"],
    description: "The ISO-8601 DateTime for when the Twitch OAuth Session expires and is automatically canceled",
    required: true,
  },
  "session.status": {
    type: ["string"],
    description: "The current status of the Twitch OAuth Session",
    values: ["pending", "complete", "canceled"],
  },
  "session.loginUrl": {
    type: ["string"],
    description: `The Twitch login URL to redirect the user to; only present on "pending" Twitch OAuth Sessions`,
  },
  "session.oauth": {
    type: ["object", "null"],
    description: `The OAuth data provided by Twitch, including an Access and Refresh Token to make authorized requests; this is only provided once for a "complete" Twitch OAuth Session, after which it is deleted, and a null value is returned instead`,
  },
  "session.oauth.access_token": {
    type: ["string"],
    description: "The Access Token which can be used to make authorized requests to Twitch",
    required: true,
  },
  "session.oauth.expires_in": {
    type: ["number"],
    description: "The time, in seconds, until the Access Token expires and may be refreshed",
    required: true,
  },
  "session.oauth.refresh_token": {
    type: ["string"],
    description: "The token used to refresh an expired Access Token",
    required: true,
  },
  "session.oauth.scope[]": {
    type: ["string"],
    description: "The scopes in the Twitch API that the Access Token is authorized access to",
    required: true,
  },
  "session.oauth.token_type": {
    type: ["string"],
    description: "The type of Access Token",
    values: ["bearer"],
    required: true,
  },
  "session.reason": {
    type: ["string"],
    description: `The reason why a Twitch OAuth Session was canceled, e.g. when the user denies permissions, or the session expiring; only present on "canceled" Twitch OAuth Sessions`,
  },
} satisfies ApiFollowUpUri["response"];

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
        headers: {
          "content-type": {
            type: ["string"],
            description: "The content type of the request body",
            values: ["application/json"],
            required: true,
          },
        },
        body: {
          clientId: {
            type: ["string"],
            description:
              "Client ID of the Twitch app to authenticate against; must be a valid Client ID controlled by Bachman Dev",
            required: true,
          },
          sessionId: {
            type: ["string"],
            description:
              "A V4 UUID to uniquely identify your OAuth session, used as a state in Twitch OAuth, and to retrieve access token later; this should be randomly generated in a secure context, e.g. via the Web Crypto API",
            required: true,
          },
          redirectUri: {
            type: ["string"],
            description: "The redirect URI that Twitch will send the Authorization Code to during the OAuth flow",
            required: true,
          },
          "scopes[]": {
            type: ["string"],
            description: "Which scopes to authorize the user for access",
            required: true,
          },
        },
        response: commonTwitchSession,
      },
      {
        method: "GET",
        uri: "/v1/twitch/session/:id",
        description: "Get an existing Twitch OAuth Session",
        params: {
          id: {
            type: ["string"],
            description: "The ID of the Twitch OAuth Session to retrieve",
          },
        },
        response: commonTwitchSession,
      },
    ],
  } satisfies ApiSuccessfulResponseBody<"GET /v1/twitch">;
  return context.json(response, HttpStatusCode.Ok);
});

export default app;
