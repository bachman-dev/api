import type { APIInteraction, APIInteractionResponse } from "discord-api-types/v10";
import type { HttpStatusCode, ResponseMap, Route } from "../../index.js";
import { z } from "zod";

export const apiV1PostDiscordRoute: Route = {
  method: "POST",
  path: "/discord",
};

export const apiV1PostDiscordHeaders = z.object({
  "x-signature-ed25519": z.string(),
  "x-signature-timestamp": z.string(),
});

export type APIv1PostDiscordHeaders = z.infer<typeof apiV1PostDiscordHeaders>;

export type APIv1PostDiscordBody = APIInteraction;

export type APIv1PostDiscordResponse = APIInteractionResponse;

export interface APIv1PostDiscordRouteGeneric {
  Body: APIv1PostDiscordBody;
  Headers: APIv1PostDiscordHeaders;
  Reply: ResponseMap<HttpStatusCode.Ok, APIInteractionResponse> &
    ResponseMap<HttpStatusCode.Unauthorized, { message: "Unauthorized, nice try." }>;
}
