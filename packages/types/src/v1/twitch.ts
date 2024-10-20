import { apiBasePostPutHeaders } from "../base.js";
import { z } from "zod";

export const apiTwitchOAuthSession = z.intersection(
  z.object({
    id: z.string().uuid(),
    expires: z.string().datetime(),
  }),
  z.discriminatedUnion("status", [
    z.object({ status: z.literal("pending"), redirectUrl: z.string().url() }),
    z.object({ status: z.literal("complete"), accessToken: z.string().nullable() }),
    z.object({ status: z.literal("canceled"), reason: z.string().optional() }),
  ]),
);
export type ApiTwitchOAuthSession = z.infer<typeof apiTwitchOAuthSession>;

// GET /v1/twitch

export const apiGetV1TwitchIndexResponse = z.object({
  message: z.string(),
});
export type ApiGetV1TwitchIndexResponse = z.infer<typeof apiGetV1TwitchIndexResponse>;

//GET /v1/twitch/session/:id

export const apiGetV1TwitchSessionParams = z.object({
  id: z.string().uuid(),
});
export type ApiGetV1TwitchSessionParams = z.infer<typeof apiGetV1TwitchSessionParams>;

export const apiGetV1TwitchSessionResponse = z.object({
  session: apiTwitchOAuthSession,
});
export type ApiGetV1TwitchSessionResponse = z.infer<typeof apiGetV1TwitchSessionResponse>;

// POST /v1/twitch/session

export const apiPostV1TwitchSessionHeaders = apiBasePostPutHeaders;
export type ApiPostV1TwitchSessionHeaders = z.infer<typeof apiPostV1TwitchSessionHeaders>;

export const apiPostV1TwitchSessionBody = z.object({
  clientId: z.string(),
  sessionId: z.string().uuid(),
});
export type ApiPostV1TwitchSessionBody = z.infer<typeof apiPostV1TwitchSessionBody>;

export const apiPostV1TwitchSessionResponse = z.object({
  session: apiTwitchOAuthSession,
});
export type ApiPostV1TwitchSessionResponse = z.infer<typeof apiPostV1TwitchSessionResponse>;
