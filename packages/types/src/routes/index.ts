import type { Route } from "../http.js";
import { apiV1PostDiscordRoute } from "./v1/discord.js";

export const routes: Route[] = [apiV1PostDiscordRoute];

export * from "./v1/discord.js";
