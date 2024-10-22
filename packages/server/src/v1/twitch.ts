import {
  type ApiErrorResponseBody,
  type ApiSuccessfulResponseBody,
  HttpStatusCode,
  apiGetV1TwitchAuthorizeQuery,
} from "@bachman-dev/api-types";
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
        "The Twitch PKCE OAuth API allows for non-web apps to get a Twitch API Access Token for an authenticated user. The app creates a Code Challenge and Code Verifier; the Code Challenge is stored during authorization, and the Code Verifier is used when getting the Access Token.",
    },
    followUpUris: [
      {
        method: "GET",
        uri: "/v1/twitch/authorize",
        description: "Start a Twitch OAuth Session with PKCE",
      },
      {
        method: "POST",
        uri: "/v1/twitch/token",
        description: "Get a Twitch API Access Token using PKCE",
      },
    ],
  } satisfies ApiSuccessfulResponseBody<"GET /v1/twitch">;
  return context.json(response, HttpStatusCode.Ok);
});

app.get("/authorize", zValidator("query", apiGetV1TwitchAuthorizeQuery, throwOnValidationError), (context) => {
  const query = context.req.valid("query");
  const newRedirectUri = encodeURI(`${new URL(context.req.url).origin}/v1/twitch/callback`);
  let redirectUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${query.client_id}&redirect_uri=${newRedirectUri}&scope=${query.scope}&state=${query.code_challenge}`;
  if (query.force_verify === true) {
    redirectUrl += "&force_verify=true";
  }
  return context.redirect(redirectUrl, HttpStatusCode.Found);
});

export default app;
