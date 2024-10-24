import { z } from "zod";

export const apiValidationIssue = z.object({
  path: z.string(),
  issue: z.string(),
});
export type ApiValidationIssue = z.infer<typeof apiValidationIssue>;

export function formatZodErrors(
  location: "cookie" | "form" | "header" | "json" | "param" | "query",
  error: z.ZodError,
): ApiValidationIssue[] {
  const issueArray: ApiValidationIssue[] = [];
  error.issues.forEach((issue) => {
    let path = `${location}: `;
    let index = 0;
    issue.path.forEach((pathPart) => {
      if (typeof pathPart === "string") {
        if (index === 0) {
          path += pathPart;
        } else {
          path += `.${pathPart}`;
        }
      } else {
        path += `[${pathPart}]`;
      }
      index += 1;
    });
    switch (issue.code) {
      case "custom":
        issueArray.push({ path, issue: "Triggered an internal validation issue" });
        break;
      case "invalid_arguments":
        issueArray.push({ path, issue: "Invalid function arguments, specific errors to follow" });
        issueArray.push(...formatZodErrors(location, issue.argumentsError));
        break;
      case "invalid_return_type":
        issueArray.push({ path, issue: "Invalid return type on function, specific errors to follow" });
        issueArray.push(...formatZodErrors(location, issue.returnTypeError));
        break;
      case "invalid_union":
        issueArray.push({ path, issue: "Invalid union, specific errors to follow" });
        issue.unionErrors.forEach((unionError) => {
          issueArray.push(...formatZodErrors(location, unionError));
        });
        break;
      default:
        issueArray.push({ path, issue: issue.message });
    }
  });
  return issueArray;
}

export const apiError = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("BAD_REQUEST"),
    message: z.literal("The request contained invalid data"),
    issues: z.array(apiValidationIssue),
  }),
  z.object({
    type: z.enum(["FORBIDDEN", "INTERNAL_SERVER_ERROR", "METHOD_NOT_ALLOWED", "NOT_FOUND", "UNAUTHORIZED"]),
    message: z.string(),
  }),
  z.object({
    type: z.literal("NOT_IMPLEMENTED"),
    message: z.string(),
    minVersion: z.string().optional(),
  }),
  z.object({
    type: z.enum(["RATE_LIMITED", "SERVICE_UNAVAILABLE"]),
    message: z.string(),
    retryAfter: z.number().min(1),
  }),
]);
export type ApiError = z.infer<typeof apiError>;
