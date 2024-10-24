import { apiBasePostPutFormHeaders } from "../base.js";
import { z } from "zod";

// GET /v1/twitch

export const apiGetV1TwitchIndexResponse = z.object({
  message: z.string(),
});
export type ApiGetV1TwitchIndexResponse = z.infer<typeof apiGetV1TwitchIndexResponse>;

// GET /v1/twitch/authorize

export const apiGetV1TwitchAuthorizeQuery = z.object({
  client_id: z.string(),
  code_challenge: z.string(),
  code_challenge_method: z.literal("S256"),
  redirect_uri: z.string().url(),
  response_type: z.literal("code"),
  scope: z.string().optional(),
  force_verify: z.boolean().optional(),
  state: z.string().optional(),
});
export type ApiGetV1TwitchAuthorizeQuery = z.infer<typeof apiGetV1TwitchAuthorizeQuery>;

// GET /v1/twitch/callback

export const apiGetV1TwitchCallbackQuery = z.intersection(
  z.object({
    state: z.string(),
  }),
  z.union([
    z.object({
      error: z.string(),
      error_description: z.string(),
      code: z.never().optional(),
      scope: z.never().optional(),
    }),
    z.object({
      code: z.string(),
      scope: z.string(),
      error: z.never().optional(),
      error_description: z.never().optional(),
    }),
  ]),
);
export type ApiGetV1TwitchCallbackQuery = z.infer<typeof apiGetV1TwitchCallbackQuery>;

// POST /v1/twitch/token

export const apiPostV1TwitchTokenHeaders = apiBasePostPutFormHeaders;
export type ApiPostV1TwitchTokenHeaders = z.infer<typeof apiPostV1TwitchTokenHeaders>;

export const apiPostV1TwitchTokenForm = z.object({
  client_id: z.string(),
  code: z.string(),
  code_verifier: z.string(),
  grant_type: z.literal("authorization_code"),
  redirect_uri: z.string().url(),
});
export type ApiPostV1TwitchTokenForm = z.infer<typeof apiPostV1TwitchTokenForm>;

export const apiPostV1TwitchTokenResponse = z.union([
  z.object({
    access_token: z.string(),
    expires_in: z.number(),
    refresh_token: z.string(),
    scope: z.array(z.string()),
    token_type: z.literal("bearer"),
    error: z.never().optional(),
  }),
  z.object({
    error: z.enum([
      "invalid_client",
      "invalid_grant",
      "invalid_request",
      "invalid_scope",
      "unauthorized_client",
      "unsupported_grant_type",
    ]),
    access_token: z.never().optional(),
    expires_in: z.never().optional(),
    refresh_token: z.never().optional(),
    scope: z.never().optional(),
    token_type: z.never().optional(),
  }),
]);
export type ApiPostV1TwitchTokenResponse = z.infer<typeof apiPostV1TwitchTokenResponse>;
