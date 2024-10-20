import { apiBasePostPutHeaders } from "../base.js";
import { z } from "zod";

export const apiTwitchOAuthState = z.intersection(
  z.object({
    id: z.string().uuid(),
  }),
  z.discriminatedUnion("status", [
    z.object({ status: z.literal("pending"), redirectUrl: z.string().url() }),
    z.object({ status: z.literal("complete"), accessToken: z.string() }),
    z.object({ status: z.literal("canceled"), reason: z.string().optional() }),
  ]),
);
export type ApiTwitchOAuthState = z.infer<typeof apiTwitchOAuthState>;

// GET /v1/twitch

export const apiGetV1TwitchIndexResponse = z.object({
  message: z.string(),
});
export type ApiGetV1TwitchIndexResponse = z.infer<typeof apiGetV1TwitchIndexResponse>;

//GET /v1/twitch/state/:id

export const apiGetV1TwitchStateParams = z.object({
  id: z.string().uuid(),
});
export type ApiGetV1TwitchStateParams = z.infer<typeof apiGetV1TwitchStateParams>;

export const apiGetV1TwitchStateResponse = z.object({
  state: apiTwitchOAuthState,
});
export type ApiGetV1TwitchStateResponse = z.infer<typeof apiGetV1TwitchStateResponse>;

// POST /v1/twitch/state

export const apiPostV1TwitchStateHeaders = apiBasePostPutHeaders;
export type ApiPostV1TwitchStateHeaders = z.infer<typeof apiPostV1TwitchStateHeaders>;

export const apiPostV1TwitchStateBody = z.object({
  clientId: z.string(),
  stateId: z.string().uuid(),
});
export type ApiPostV1TwitchStateBody = z.infer<typeof apiPostV1TwitchStateBody>;

export const apiPostV1TwitchStateResponse = z.object({
  state: apiTwitchOAuthState,
});
export type ApiPostV1TwitchStateResponse = z.infer<typeof apiPostV1TwitchStateResponse>;
