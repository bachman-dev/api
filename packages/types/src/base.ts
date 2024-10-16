import { z } from "zod";

export const apiBaseResponse = z.object({
  followUpUris: z.array(
    z.object({
      method: z.enum(["DELETE", "GET", "POST", "PUT"]),
      uri: z.string(),
      description: z.string(),
    }),
  ),
});
export type ApiBaseResponse = z.infer<typeof apiBaseResponse>;

export const apiBasePostPutHeaders = z.object({
  "content-type": z.literal("application/json"),
});
export type ApiBasePostPutHeaders = z.infer<typeof apiBasePostPutHeaders>;
