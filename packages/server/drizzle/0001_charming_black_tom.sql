ALTER TABLE `twitch_client_states` RENAME TO `twitch_client_sessions`;--> statement-breakpoint
ALTER TABLE `twitch_client_sessions` RENAME COLUMN "state" TO "id";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_twitch_client_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text(30) NOT NULL,
	`redirect_uri` text NOT NULL,
	`scopes` text NOT NULL,
	`status` text NOT NULL,
	`access_token` text,
	FOREIGN KEY (`client_id`) REFERENCES `twitch_clients`(`client_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_twitch_client_sessions`("id", "client_id", "redirect_uri", "scopes", "status", "access_token") SELECT "id", "client_id", "redirect_uri", "scopes", "status", "access_token" FROM `twitch_client_sessions`;--> statement-breakpoint
DROP TABLE `twitch_client_sessions`;--> statement-breakpoint
ALTER TABLE `__new_twitch_client_sessions` RENAME TO `twitch_client_sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;