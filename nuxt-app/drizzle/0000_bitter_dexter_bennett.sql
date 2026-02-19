CREATE TABLE `reserva` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quartoId` integer NOT NULL,
	`acessorioId` integer NOT NULL,
	`checkIn` integer,
	`checkOut` integer,
	`createdAt` integer NOT NULL,
	`updateAt` integer NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`quartoId`) REFERENCES `quarto`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`acessorioId`) REFERENCES `acessorio`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quarto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`precoBase` real NOT NULL,
	`desconto` real NOT NULL,
	`tipoQuarto` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updateAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `acessorio` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`garagem` integer NOT NULL,
	`numeroGaragem` integer NOT NULL,
	`frigobar` integer NOT NULL,
	`tv` integer NOT NULL,
	`wifi` integer NOT NULL,
	`piscina` integer NOT NULL,
	`hidromassagem` integer NOT NULL,
	`comida` text,
	`bebida` text,
	`createdAt` integer NOT NULL,
	`updateAt` integer NOT NULL
);
