import type { ApiGetVersionResponse, ApiGetVersionsResponse } from "./versions/index.js";
import type { ApiError } from "./errors.js";
import { apiBaseResponse } from "./base.js";
import { z } from "zod";

export const apiGetIndexResponse = apiBaseResponse.extend({
  message: z.string(),
});
export type ApiGetIndexResponse = z.infer<typeof apiGetIndexResponse>;

export interface ApiResponses {
  "GET /": ApiGetIndexResponse;
  "GET /:version": ApiGetVersionResponse;
  "GET /versions": ApiGetVersionsResponse;
}

export interface ApiSuccessfulResponse<T extends keyof ApiResponses> {
  data: ApiResponses[T];
  success: true;
  error?: never;
}

export interface ApiErrorResponse {
  error: ApiError;
  success: false;
  data?: never;
}

export type ApiResponse<T extends keyof ApiResponses> = ApiErrorResponse | ApiSuccessfulResponse<T>;

export * from "./base.js";
export * from "./errors.js";
export * from "./http.js";
export * from "./versions/index.js";
