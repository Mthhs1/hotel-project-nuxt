CREATE TABLE `acessorio` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`garage` integer NOT NULL,
	`nGarage` integer NOT NULL,
	`miniFridge` integer NOT NULL,
	`tv` integer NOT NULL,
	`wifi` integer NOT NULL,
	`piscine` integer NOT NULL,
	`hydromassage` integer NOT NULL,
	`foods` text,
	`drinks` text,
	`createdAt` integer NOT NULL,
	`updateAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` integer NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`birth_day` integer NOT NULL,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE TABLE `quarto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`basePrice` real NOT NULL,
	`discount` real NOT NULL,
	`priceMultiplier` real NOT NULL,
	`url` text NOT NULL,
	`hasDiscount` integer,
	`roomType` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updateAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reserva` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quartoId` integer NOT NULL,
	`acessorioId` integer NOT NULL,
	`userId` integer NOT NULL,
	`checkIn` integer,
	`checkOut` integer,
	`createdAt` integer NOT NULL,
	`updateAt` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`quartoId`) REFERENCES `quarto`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`acessorioId`) REFERENCES `acessorio`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
