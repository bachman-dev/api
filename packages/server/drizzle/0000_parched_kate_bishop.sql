CREATE TABLE `twitch_client_states` (
	`code_challenge` text PRIMARY KEY NOT NULL,
	`client_id` text(30) NOT NULL,
	`redirect_uri` text NOT NULL,
	`expires` integer NOT NULL,
	`state` text,
	`code` text,
	`twitch_code` text,
	FOREIGN KEY (`client_id`) REFERENCES `twitch_clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `twitch_clients` (
	`id` text(30) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`client_secret` text(30) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `twitch_clients_to_users` (
	`client_id` text NOT NULL,
	`user_id` text NOT NULL,
	PRIMARY KEY(`client_id`, `user_id`),
	FOREIGN KEY (`client_id`) REFERENCES `twitch_clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `twitch_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `twitch_users` (
	`id` text PRIMARY KEY NOT NULL,
	`user_name` text NOT NULL
);
