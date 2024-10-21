CREATE TABLE `twitch_client_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text(30) NOT NULL,
	`redirect_uri` text NOT NULL,
	`login_url` text NOT NULL,
	`scopes` text NOT NULL,
	`expires` integer NOT NULL,
	`status` text NOT NULL,
	`cancel_reason` text,
	FOREIGN KEY (`client_id`) REFERENCES `twitch_clients`(`client_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `twitch_clients` (
	`client_id` text(30) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`client_secret` text(30) NOT NULL
);
