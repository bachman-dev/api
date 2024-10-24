import { z } from "zod";

export const apiBasePostPutFormHeaders = z.object({
  "content-type": z.literal("application/x-www-form-urlencoded"),
});
export type ApiBasePostPutFormHeaders = z.infer<typeof apiBasePostPutJsonHeaders>;

export const apiBasePostPutJsonHeaders = z.object({
  "content-type": z.literal("application/json"),
});
export type ApiBasePostPutJsonHeaders = z.infer<typeof apiBasePostPutJsonHeaders>;
