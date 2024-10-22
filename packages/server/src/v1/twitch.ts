import { type ApiSuccessfulResponseBody, HttpStatusCode } from "@bachman-dev/api-types";
import type { Env } from "../types/cloudflare.js";
import { Hono } from "hono";

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

export default app;
