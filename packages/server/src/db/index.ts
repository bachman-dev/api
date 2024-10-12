import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import schema from "./schema.js";

export function getDrizzle(d1Database: D1Database): DrizzleD1Database<typeof schema> {
  return drizzle(d1Database, { schema });
}
