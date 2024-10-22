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
  scope: z.string(),
  force_verify: z.boolean().optional(),
  state: z.string().optional(),
});
export type ApiGetV1TwitchAuthorizeQuery = z.infer<typeof apiGetV1TwitchAuthorizeQuery>;

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
