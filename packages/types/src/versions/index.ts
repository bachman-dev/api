import { z } from "zod";

export const apiVersion = z.string().startsWith("v");
export type ApiVersion = z.infer<typeof apiVersion>;

export const apiVersionData = z.intersection(
  z.object({
    name: apiVersion,
    description: z.string(),
  }),
  z.discriminatedUnion("status", [
    z.object({
      status: z.literal("active"),
    }),
    z.object({
      status: z.literal("deprecated"),
      deprecationDate: z.string().datetime(),
    }),
    z.object({
      status: z.literal("removed"),
      deprecationDate: z.string().datetime(),
      removalDate: z.string().datetime(),
    }),
  ]),
);
export type ApiVersionData = z.infer<typeof apiVersionData>;

export const apiGetVersionResponse = z.object({
  version: apiVersionData,
});
export type ApiGetVersionResponse = z.infer<typeof apiGetVersionResponse>;

export const apiGetVersionsResponse = z.object({
  versions: z.array(apiVersionData),
});
export type ApiGetVersionsResponse = z.infer<typeof apiGetVersionsResponse>;
