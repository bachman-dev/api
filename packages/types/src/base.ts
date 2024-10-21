import { z } from "zod";

export const apiBasePostPutHeaders = z.object({
  "content-type": z.literal("application/json"),
});
export type ApiBasePostPutHeaders = z.infer<typeof apiBasePostPutHeaders>;
