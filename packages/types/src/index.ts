import { z } from "zod";

export const apiVersion = z.object({
  version: z.string(),
  status: z.enum(["active", "deprecated", "removed"]),
  deprecationDate: z.date().optional(),
  removalDate: z.date().optional(),
});
export type ApiVersion = z.infer<typeof apiVersion>;

export const apiGetIndexResponse = z.object({
  success: z.literal(true),
  versions: z.array(apiVersion),
});
export type ApiGetIndexResponse = z.infer<typeof apiGetIndexResponse>;

export const baseApiPostPutHeaders = z.object({
  "content-type": z.literal("application/json"),
});
export type BaseApiPostPutHeaders = z.infer<typeof baseApiPostPutHeaders>;

export * from "./errors.js";
export * from "./http.js";
