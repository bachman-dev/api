import type { ApiErrorResponse } from "./errors.js";
import { z } from "zod";

export type ApiResponse<T> = ApiErrorResponse | { data: T; success: true };

export const apiVersion = z.object({
  version: z.string(),
  status: z.enum(["active", "deprecated", "removed"]),
  deprecationDate: z.date().optional(),
  removalDate: z.date().optional(),
});
export type ApiVersion = z.infer<typeof apiVersion>;

export const apiGetIndexResponse = z.object({
  versions: z.array(apiVersion),
});
export type ApiGetIndexResponse = z.infer<typeof apiGetIndexResponse>;

export const apiBaseApiPostPutHeaders = z.object({
  "content-type": z.literal("application/json"),
});
export type ApiBaseApiPostPutHeaders = z.infer<typeof apiBaseApiPostPutHeaders>;

export * from "./errors.js";
export * from "./http.js";
