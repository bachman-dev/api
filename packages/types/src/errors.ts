import { z } from "zod";

export const apiValidationIssue = z.object({
  path: z.string(),
  issue: z.string(),
});
export type ApiValidationIssue = z.infer<typeof apiValidationIssue>;

function unknownToString(value: unknown): string {
  switch (typeof value) {
    case "undefined":
      return "undefined";
    case "string":
      return `String(${value})`;
    case "bigint":
      return `BigInt(${value})`;
    case "boolean":
      return `Boolean(${value ? "true" : "false"})`;
    case "number": {
      if (Number.isNaN(value)) {
        return "NaN";
      }
      return `Number(${value})`;
    }
    case "function":
      return `Function(${value.name})`;
    case "symbol":
      return `Symbol(${value.description ?? "<no description>"})`;
    case "object": {
      if (value === null) {
        return "null";
      }
      if (value.constructor.name !== "Object") {
        return value.constructor.name;
      }
      let substring = `Object { `;
      for (const [key, anyValue] of Object.entries(value)) {
        const unknownValue = anyValue as unknown;
        substring += `${key}: ${unknownToString(unknownValue)}, `;
      }
      substring += `}`;
      return substring;
    }
  }
}

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
      case "invalid_literal":
        issueArray.push({
          path,
          issue: `Expected ${unknownToString(issue.expected)} but got ${unknownToString(issue.received)}`,
        });
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
    message: z.string(),
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
