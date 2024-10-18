import { z } from "zod";

export const apiTwitchOAuthState = z.intersection(
  z.object({
    id: z.string().uuid(),
  }),
  z.discriminatedUnion("status", [
    z.object({ status: z.literal("pending"), redirectUrl: z.string().url() }),
    z.object({ status: z.literal("complete"), accessToken: z.string() }),
    z.object({ status: z.literal("cancelled"), reason: z.string().optional() }),
  ]),
);
export type ApiTwitchOAuthState = z.infer<typeof apiTwitchOAuthState>;

// GET /v1/twitch

export const apiGetV1TwitchIndexResponse = z.object({
  message: z.string(),
});
export type ApiGetV1TwitchIndexResponse = z.infer<typeof apiGetV1TwitchIndexResponse>;

// POST /v1/twitch/redirect/:clientId

export const apiPostV1TwitchRedirectParams = z.object({
  clientId: z.string(),
});
export type ApiPostV1TwitchRedirectParams = z.infer<typeof apiPostV1TwitchRedirectParams>;

export const apiPostV1TwitchRedirectBody = z.object({
  stateId: z.string().uuid(),
});
export type ApiPostV1TwitchRedirectBody = z.infer<typeof apiPostV1TwitchRedirectBody>;

export const apiPostV1TwitchRedirectResponse = z.object({
  state: apiTwitchOAuthState,
});
export type ApiPostV1TwitchRedirectResponse = z.infer<typeof apiPostV1TwitchRedirectResponse>;
