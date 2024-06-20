import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DB_URL ?? "",
    authToken: process.env.TURSO_DB_TOKEN ?? "",
  },
});
