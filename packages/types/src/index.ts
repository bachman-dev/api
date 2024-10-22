import type {
  ApiGetV1TwitchIndexResponse,
  ApiPostV1TwitchTokenForm,
  ApiPostV1TwitchTokenHeaders,
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

export type ApiEndpoints = "GET /:version" | "GET /" | "GET /v1/twitch" | "GET /versions";

export interface ApiRequestHeaders {
  "POST /v1/twitch/token": ApiPostV1TwitchTokenHeaders;
}

export interface ApiRequestForms {
  "POST /v1/twitch/token": ApiPostV1TwitchTokenForm;
}

export interface ApiRequestOptions<T extends ApiEndpoints> {
  form: T extends keyof ApiRequestForms ? ApiRequestForms[T] : null;
  headers: T extends keyof ApiRequestHeaders ? ApiRequestHeaders[T] : null;
}

export interface ApiResponseBodies {
  "GET /": ApiGetIndexResponse;
  "GET /:version": ApiGetVersionResponse;
  "GET /v1/twitch": ApiGetV1TwitchIndexResponse;
  "GET /versions": ApiGetVersionsResponse;
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

export type ApiOAuthResponseBody =
  | {
      access_token: string;
      expires_in: number;
      refresh_token: string;
      scope: string[];
      token_type: "bearer";
    }
  | {
      error:
        | "invalid_client"
        | "invalid_grant"
        | "invalid_request"
        | "invalid_scope"
        | "unauthorized_client"
        | "unsupported_grant_type";
    };
