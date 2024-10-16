import type { ApiGetVersionResponse, ApiGetVersionsResponse } from "./versions/index.js";
import type { ApiError } from "./errors.js";
import { z } from "zod";

export * from "./errors.js";
export * from "./http.js";
export * from "./versions/index.js";

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

export type ApiEndpoints = "GET /:version" | "GET /" | "GET /versions";

export interface ApiResponseBodies {
  "GET /": ApiGetIndexResponse;
  "GET /:version": ApiGetVersionResponse;
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
