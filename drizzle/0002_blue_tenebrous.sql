CREATE TABLE `adviceCards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consultationSessionId` int NOT NULL,
	`userId` int NOT NULL,
	`cardName` varchar(255) NOT NULL,
	`cardImage` text,
	`cardReading` text NOT NULL,
	`cardType` varchar(64) NOT NULL DEFAULT 'tarot',
	`isRevealed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adviceCards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consultationSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`duration` enum('20','50') NOT NULL,
	`price` int NOT NULL,
	`status` enum('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
	`paymentId` varchar(255),
	`paymentMethod` varchar(64),
	`consultationDate` timestamp,
	`consultationTopic` text,
	`consultationNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultationSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `adviceCards` ADD CONSTRAINT `adviceCards_consultationSessionId_consultationSessions_id_fk` FOREIGN KEY (`consultationSessionId`) REFERENCES `consultationSessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `adviceCards` ADD CONSTRAINT `adviceCards_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consultationSessions` ADD CONSTRAINT `consultationSessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;