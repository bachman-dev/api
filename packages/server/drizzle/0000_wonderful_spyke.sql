CREATE TABLE `twitch_client_states` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text(30) NOT NULL,
	`redirect_uri` text NOT NULL,
	`code_challenge` text NOT NULL,
	`expires` integer NOT NULL,
	`code` text(40),
	`twitch_code` text,
	FOREIGN KEY (`client_id`) REFERENCES `twitch_clients`(`client_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `twitch_clients` (
	`client_id` text(30) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`client_secret` text(30) NOT NULL
);
