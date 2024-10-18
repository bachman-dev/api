import { z } from "zod";

export const apiVersion = z.string().startsWith("v");
export type ApiVersion = z.infer<typeof apiVersion>;

export const apiVersionData = z.object({
  version: apiVersion,
  description: z.string(),
  status: z.enum(["active", "deprecated", "removed"]),
  deprecationDate: z.date().optional(),
  removalDate: z.date().optional(),
});
export type ApiVersionData = z.infer<typeof apiVersionData>;

export const apiGetVersionResponse = z.object({
  version: apiVersionData,
});
export type ApiGetVersionResponse = z.infer<typeof apiGetVersionResponse>;

export const apiGetVersionsResponse = z.object({
  versions: z.array(apiVersionData),
});
export type ApiGetVersionsResponse = z.infer<typeof apiGetVersionsResponse>;
