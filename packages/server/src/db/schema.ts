import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const twitchClients = sqliteTable("twitch_clients", {
  clientId: text("client_id", { length: 30 }).primaryKey(),
  name: text("name").notNull(),
  clientSecret: text("client_secret", { length: 30 }).notNull(),
});
export type NewTwitchClient = typeof twitchClients.$inferInsert;
export type TwitchClient = typeof twitchClients.$inferSelect;

export const twitchClientStates = sqliteTable("twitch_client_states", {
  codeChallenge: text("code_challenge").primaryKey(),
  clientId: text("client_id", { length: 30 })
    .notNull()
    .references(() => twitchClients.clientId),
  redirectUri: text("redirect_uri").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
  code: text("code").notNull(),
  twitchCode: text("twitch_code").notNull(),
});
export type NewTwitchClientState = typeof twitchClientStates.$inferInsert;
export type TwitchClientState = typeof twitchClientStates.$inferSelect;

export const twitchClientsRelations = relations(twitchClients, ({ many }) => {
  return {
    states: many(twitchClientStates),
  };
});

export const twitchClientStatesRelations = relations(twitchClientStates, ({ one }) => {
  return {
    client: one(twitchClients, {
      fields: [twitchClientStates.clientId],
      references: [twitchClients.clientId],
    }),
  };
});

const schema = {
  twitchClients,
  twitchClientStates,
  twitchClientsRelations,
  twitchClientStatesRelations,
};

export default schema;
