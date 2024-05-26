import { type APIInteraction, type APIInteractionResponse, InteractionResponseType } from "discord-api-types/v10";
import {
  type APIv1PostDiscordHeaders,
  type APIv1PostDiscordRouteGeneric,
  HttpStatusCode,
} from "@bachman-dev/api-types";
import type { FastifyInstance } from "fastify";

export default function apiV1PostDiscordInteraction(app: FastifyInstance): void {
  app.post<APIv1PostDiscordRouteGeneric>("/discord", async (request, reply) => {
    const { body, headers } = request;
    const isAuthorized = await verifyDiscordRequest(headers);
    if (!isAuthorized) {
      await reply.code(HttpStatusCode.Unauthorized).send({
        message: "Unauthorized, nice try.",
      });
    }
    const response = await handleInteraction(body);
    await reply.code(HttpStatusCode.Ok).send(response);
  });
}

export async function verifyDiscordRequest(headers: APIv1PostDiscordHeaders): Promise<boolean> {
  return true;
}

export async function handleInteraction(interaction: APIInteraction): Promise<APIInteractionResponse> {
  return {
    type: InteractionResponseType.Pong,
  };
}
