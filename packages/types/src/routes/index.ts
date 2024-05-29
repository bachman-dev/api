import type { Route } from "../http.js";
import { z } from "zod";

export const routes: readonly Route[] = [] as const;

export const versionedRouteHeader = z.object({
  "x-api-version": z.string(),
});

export const apiVersion = z.string().date();

export type VersionedRouteHeader = z.infer<typeof versionedRouteHeader>;
