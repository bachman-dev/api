import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const twitchClients = sqliteTable("twitch_clients", {
  clientId: text("client_id", { length: 30 }).primaryKey(),
  name: text("name").notNull(),
  clientSecret: text("client_secret", { length: 30 }).notNull(),
});
export type NewTwitchClient = typeof twitchClients.$inferInsert;
export type TwitchClient = typeof twitchClients.$inferSelect;

export const twitchClientStates = sqliteTable("twitch_client_states", {
  state: text("state").primaryKey(),
  clientId: text("client_id", { length: 30 })
    .notNull()
    .references(() => twitchClients.clientId),
  status: text("status", { enum: ["pending", "completed", "cancelled"] }).notNull(),
  accessToken: text("access_token"),
});
export type NewTwitchClientState = typeof twitchClientStates.$inferInsert;
export type TwitchClientState = typeof twitchClientStates.$inferSelect;

export const twitchClientRelations = relations(twitchClients, ({ many }) => {
  return {
    states: many(twitchClientStates),
  };
});

export const twitchClientStatesRelations = relations(twitchClientStates, ({ one }) => {
  return {
    client: one(twitchClients),
  };
});

const schema = {
  twitchClients,
  twitchClientStates,
  twitchClientRelations,
  twitchClientStatesRelations,
};

export default schema;
