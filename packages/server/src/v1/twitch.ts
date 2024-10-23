import {
  type ApiErrorResponseBody,
  type ApiSuccessfulResponseBody,
  HttpStatusCode,
  apiGetV1TwitchAuthorizeQuery,
  apiGetV1TwitchCallbackQuery,
} from "@bachman-dev/api-types";
import type { Env } from "../types/cloudflare.js";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { getDrizzle } from "../db/index.js";
import randomCode from "../util/randomCode.js";
import { throwOnValidationError } from "../errors.js";
import { twitchClientStates } from "../db/schema.js";
import withinTenMinutes from "../util/withinTenMinutes.js";
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

app.get("/authorize", zValidator("query", apiGetV1TwitchAuthorizeQuery, throwOnValidationError), async (context) => {
  const query = context.req.valid("query");
  const drizzle = getDrizzle(context.env.DB);
  const twitchClient = await drizzle.query.twitchClients.findFirst({
    where: (client) => eq(client.id, query.client_id),
  });
  if (typeof twitchClient === "undefined") {
    const response = {
      success: false,
      error: {
        type: "BAD_REQUEST",
        message: "The request contained invalid data",
        issues: [
          {
            path: "query: client_id",
            issue: "This Client ID is not authorized to use this API",
          },
        ],
      },
    } satisfies ApiErrorResponseBody;
    return context.json(response, HttpStatusCode.BadRequest);
  }
  const twitchState = await drizzle.query.twitchClientStates.findFirst({
    where: (clientState) => eq(clientState.codeChallenge, query.code_challenge),
  });
  if (typeof twitchState === "undefined") {
    await drizzle.insert(twitchClientStates).values({
      codeChallenge: query.code_challenge,
      clientId: query.client_id,
      redirectUri: query.redirect_uri,
      expires: withinTenMinutes(new Date()),
      state: query.state ?? null,
    });
  } else if (twitchState.code === null) {
    await drizzle
      .update(twitchClientStates)
      .set({
        clientId: query.client_id,
        redirectUri: query.redirect_uri,
        expires: withinTenMinutes(new Date()),
        state: query.state ?? null,
      })
      .where(eq(twitchClientStates.codeChallenge, twitchState.codeChallenge));
  } else {
    const response = {
      success: false,
      error: {
        type: "BAD_REQUEST",
        message: "The request contained invalid data",
        issues: [
          {
            path: "query: code_challenge",
            issue: "This Code Challenge has already been used to authorize a user against the Twitch API",
          },
        ],
      },
    } satisfies ApiErrorResponseBody;
    return context.json(response, HttpStatusCode.BadRequest);
  }
  const newRedirectUri = encodeURI(`${new URL(context.req.url).origin}/v1/twitch/callback`);
  let redirectUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${query.client_id}&redirect_uri=${newRedirectUri}&scope=${query.scope}&state=${query.code_challenge}`;
  if (query.force_verify === true) {
    redirectUrl += "&force_verify=true";
  }
  return context.redirect(redirectUrl, HttpStatusCode.Found);
});

app.get("/callback", zValidator("query", apiGetV1TwitchCallbackQuery), async (context) => {
  const CODE_LENGTH = 40;
  const query = context.req.valid("query");
  const drizzle = getDrizzle(context.env.DB);
  const twitchState = await drizzle.query.twitchClientStates.findFirst({
    where: (twitchState) => eq(twitchState.codeChallenge, query.state),
  });
  if (typeof twitchState === "undefined") {
    const response = {
      success: false,
      error: {
        type: "BAD_REQUEST",
        message: "The request contained invalid data",
        issues: [
          {
            path: "query: state",
            issue: "The given state has not been used in this authentication flow",
          },
        ],
      },
    } satisfies ApiErrorResponseBody;
    return context.json(response, HttpStatusCode.BadRequest);
  }
  let redirectUrl = twitchState.redirectUri;
  if (typeof query.code === "undefined") {
    redirectUrl += `?error=${query.error}&error_description=${query.error_description}`;
  } else {
    const code = randomCode(CODE_LENGTH);
    await drizzle
      .update(twitchClientStates)
      .set({
        code,
        twitchCode: query.code,
      })
      .where(eq(twitchClientStates.codeChallenge, twitchState.codeChallenge));
    redirectUrl += `?code=${code}&scope=${query.scope}`;
  }
  if (twitchState.state !== null) {
    redirectUrl += `&state=${twitchState.state}`;
  }
  return context.redirect(redirectUrl, HttpStatusCode.Found);
});

export default app;
