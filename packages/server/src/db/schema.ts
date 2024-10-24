import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const twitchClients = sqliteTable("twitch_clients", {
  id: text("id", { length: 30 }).primaryKey(),
  name: text("name").notNull(),
  clientSecret: text("client_secret", { length: 30 }).notNull(),
});
export type NewTwitchClient = typeof twitchClients.$inferInsert;
export type TwitchClient = typeof twitchClients.$inferSelect;

export const twitchUsers = sqliteTable("twitch_users", {
  id: text("id").primaryKey(),
  userName: text("user_name").notNull(),
});

export const twitchClientsToUsers = sqliteTable(
  "twitch_clients_to_users",
  {
    clientId: text("client_id")
      .notNull()
      .references(() => twitchClients.id),
    userId: text("user_id")
      .notNull()
      .references(() => twitchUsers.id),
  },
  (table) => {
    return {
      pKey: primaryKey({ columns: [table.clientId, table.userId] }),
    };
  },
);

export const twitchClientStates = sqliteTable("twitch_client_states", {
  codeChallenge: text("code_challenge").primaryKey(),
  clientId: text("client_id", { length: 30 })
    .notNull()
    .references(() => twitchClients.id),
  redirectUri: text("redirect_uri").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
  state: text("state"),
  code: text("code"),
  twitchCode: text("twitch_code"),
});
export type NewTwitchClientState = typeof twitchClientStates.$inferInsert;
export type TwitchClientState = typeof twitchClientStates.$inferSelect;

export const twitchClientsRelations = relations(twitchClients, ({ many }) => {
  return {
    twitchClientsToUsers: many(twitchClientsToUsers),
  };
});

export const twitchUsersRelations = relations(twitchUsers, ({ many }) => {
  return {
    twitchClientsToUsers: many(twitchClientsToUsers),
  };
});

export const twitchClientsToUsersRelations = relations(twitchClientsToUsers, ({ one }) => {
  return {
    client: one(twitchClients, {
      fields: [twitchClientsToUsers.clientId],
      references: [twitchClients.id],
    }),
    user: one(twitchUsers, {
      fields: [twitchClientsToUsers.userId],
      references: [twitchUsers.id],
    }),
  };
});

export const twitchClientStatesRelations = relations(twitchClientStates, ({ one }) => {
  return {
    client: one(twitchClients, {
      fields: [twitchClientStates.clientId],
      references: [twitchClients.id],
    }),
  };
});

const schema = {
  twitchClients,
  twitchUsers,
  twitchClientsToUsers,
  twitchClientsRelations,
  twitchUsersRelations,
  twitchClientsToUsersRelations,
  twitchClientStates,
  twitchClientStatesRelations,
};

export default schema;
