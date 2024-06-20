import { type LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import schema from "./schema.js";

export function getDrizzle(): LibSQLDatabase<typeof schema> {
  if (typeof process.env.TURSO_DB_URL === "undefined" || typeof process.env.TURSO_DB_TOKEN === "undefined") {
    throw new Error("Turso DB URL and/or Token not defined.");
  }

  const sql = createClient({ url: process.env.TURSO_DB_URL, authToken: process.env.TURSO_DB_TOKEN });

  return drizzle(sql, { schema });
}
