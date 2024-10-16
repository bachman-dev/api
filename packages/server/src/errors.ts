import { type ApiErrorResponseBody, HttpStatusCode, formatZodErrors } from "@bachman-dev/api-types";
import type { Env } from "./types/cloudflare.js";
import type { Hook } from "@hono/zod-validator";

// @ts-expect-error: Return early only on validation error
export const throwOnValidationError: Hook<unknown, { Bindings: Env }, string> = (result, context) => {
  if (!result.success) {
    const response = {
      success: false,
      error: {
        type: "VALIDATION",
        message: "The request contained invalid data",
        issues: formatZodErrors(result.error),
      },
    } satisfies ApiErrorResponseBody;
    return context.json(response, HttpStatusCode.BadRequest);
  }
};
