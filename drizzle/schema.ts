import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// 부적 구매 내역 테이블
export const purchasedTalismans = mysqlTable("purchasedTalismans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  talismanId: varchar("talismanId", { length: 64 }).notNull(),
  talismanName: varchar("talismanName", { length: 255 }).notNull(),
  talismanImage: text("talismanImage"),
  price: int("price").notNull(),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
  imageUrl: text("imageUrl"),
  consultationType: varchar("consultationType", { length: 64 }),
  consultationContent: text("consultationContent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PurchasedTalisman = typeof purchasedTalismans.$inferSelect;
export type InsertPurchasedTalisman = typeof purchasedTalismans.$inferInsert;

// 루나벨 1:1 전화 상담 세션
export const consultationSessions = mysqlTable("consultationSessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  duration: mysqlEnum("duration", ["20", "50"]).notNull(),
  price: int("price").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
  paymentId: varchar("paymentId", { length: 255 }),
  paymentMethod: varchar("paymentMethod", { length: 64 }),
  consultationDate: timestamp("consultationDate"),
  consultationTopic: text("consultationTopic"),
  consultationNotes: text("consultationNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConsultationSession = typeof consultationSessions.$inferSelect;
export type InsertConsultationSession = typeof consultationSessions.$inferInsert;

// 루나벨 조언 카드
export const adviceCards = mysqlTable("adviceCards", {
  id: int("id").autoincrement().primaryKey(),
  consultationSessionId: int("consultationSessionId").notNull().references(() => consultationSessions.id),
  userId: int("userId").notNull().references(() => users.id),
  cardName: varchar("cardName", { length: 255 }).notNull(),
  cardImage: text("cardImage"),
  cardReading: text("cardReading").notNull(),
  cardType: varchar("cardType", { length: 64 }).default("tarot").notNull(),
  isRevealed: boolean("isRevealed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdviceCard = typeof adviceCards.$inferSelect;
export type InsertAdviceCard = typeof adviceCards.$inferInsert;

// 사용자 알림
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  consultationSessionId: int("consultationSessionId").references(() => consultationSessions.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["advice_card", "consultation_complete", "general"]).default("general").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
