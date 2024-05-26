import type { Route } from "../http.js";
import { apiV1PostDiscordRoute } from "./v1/discord.js";

export const routes: readonly Route[] = [apiV1PostDiscordRoute] as const;

export * from "./v1/discord.js";
