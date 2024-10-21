import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const twitchClients = sqliteTable("twitch_clients", {
  clientId: text("client_id", { length: 30 }).primaryKey(),
  name: text("name").notNull(),
  clientSecret: text("client_secret", { length: 30 }).notNull(),
});
export type NewTwitchClient = typeof twitchClients.$inferInsert;
export type TwitchClient = typeof twitchClients.$inferSelect;

export const twitchClientSessions = sqliteTable("twitch_client_sessions", {
  id: text("id").primaryKey(),
  clientId: text("client_id", { length: 30 })
    .notNull()
    .references(() => twitchClients.clientId),
  redirectUri: text("redirect_uri").notNull(),
  scopes: text("scopes").notNull(),
  status: text("status", { enum: ["pending", "completed", "canceled"] }).notNull(),
  accessToken: text("access_token"),
});
export type NewTwitchClientSession = typeof twitchClientSessions.$inferInsert;
export type TwitchClientSession = typeof twitchClientSessions.$inferSelect;

export const twitchClientRelations = relations(twitchClients, ({ many }) => {
  return {
    sessions: many(twitchClientSessions),
  };
});

export const twitchClientSessionsRelations = relations(twitchClientSessions, ({ one }) => {
  return {
    client: one(twitchClients),
  };
});

const schema = {
  twitchClients,
  twitchClientSessions,
  twitchClientRelations,
  twitchClientSessionsRelations,
};

export default schema;
