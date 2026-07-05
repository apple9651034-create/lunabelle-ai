CREATE TABLE `purchasedTalismans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`talismanId` varchar(64) NOT NULL,
	`talismanName` varchar(255) NOT NULL,
	`talismanImage` text,
	`price` int NOT NULL,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	`imageUrl` text,
	`consultationType` varchar(64),
	`consultationContent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `purchasedTalismans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `purchasedTalismans` ADD CONSTRAINT `purchasedTalismans_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;