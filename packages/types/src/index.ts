import type {
  ApiGetV1TwitchIndexResponse,
  ApiGetV1TwitchStateParams,
  ApiGetV1TwitchStateResponse,
  ApiPostV1TwitchStateBody,
  ApiPostV1TwitchStateHeaders,
  ApiPostV1TwitchStateResponse,
} from "./v1/twitch.js";
import type { ApiGetVersionResponse, ApiGetVersionsResponse } from "./versions/index.js";
import type { ApiError } from "./errors.js";

import { z } from "zod";

export * from "./errors.js";
export * from "./http.js";
export * from "./versions/index.js";
export * from "./v1/twitch.js";

export const apiGetIndexResponse = z.object({
  message: z.string(),
});
export type ApiGetIndexResponse = z.infer<typeof apiGetIndexResponse>;

export const apiFollowUpUri = z.object({
  method: z.enum(["DELETE", "GET", "POST", "PUT"]),
  uri: z.string(),
  description: z.string(),
});
export type ApiFollowUpUri = z.infer<typeof apiFollowUpUri>;

export type ApiEndpoints =
  | "GET /:version"
  | "GET /"
  | "GET /v1/twitch"
  | "GET /v1/twitch/state/:id"
  | "GET /versions"
  | "POST /v1/twitch/state";

export interface ApiRequestParams {
  "GET /v1/twitch/state/:id": ApiGetV1TwitchStateParams;
}

export interface ApiRequestQueries {
  "GET /": null;
}

export interface ApiRequestHeaders {
  "POST /v1/twitch/state": ApiPostV1TwitchStateHeaders;
}

export interface ApiRequestBodies {
  "POST /v1/twitch/state": ApiPostV1TwitchStateBody;
}

export interface ApiRequestOptions<T extends ApiEndpoints> {
  body: T extends keyof ApiRequestBodies ? ApiRequestBodies[T] : null;
  headers: T extends keyof ApiRequestHeaders ? ApiRequestHeaders[T] : null;
  params: T extends keyof ApiRequestParams ? ApiRequestParams[T] : null;
  query: T extends keyof ApiRequestQueries ? ApiRequestQueries[T] : null;
}

export interface ApiResponseBodies {
  "GET /": ApiGetIndexResponse;
  "GET /:version": ApiGetVersionResponse;
  "GET /v1/twitch": ApiGetV1TwitchIndexResponse;
  "GET /v1/twitch/state/:id": ApiGetV1TwitchStateResponse;
  "GET /versions": ApiGetVersionsResponse;
  "POST /v1/twitch/state": ApiPostV1TwitchStateResponse;
}

export interface ApiSuccessfulResponseBody<T extends ApiEndpoints> {
  data: ApiResponseBodies[T];
  followUpUris: ApiFollowUpUri[];
  success: true;
  error?: never;
}

export interface ApiErrorResponseBody {
  error: ApiError;
  success: false;
  data?: never;
  followUpUris?: never;
}

export type ApiResponseBody<T extends ApiEndpoints> = ApiErrorResponseBody | ApiSuccessfulResponseBody<T>;
