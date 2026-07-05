import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  talismanId: varchar("talismanId", { length: 64 }).notNull(), // 부적 ID (연애, 재물, 건강, 보호)
  talismanName: varchar("talismanName", { length: 255 }).notNull(), // 부적 이름
  talismanImage: text("talismanImage"), // 부적 이미지 URL
  price: int("price").notNull(), // 가격 (크레딧)
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(), // 구매 날짜
  imageUrl: text("imageUrl"), // 저장된 이미지 URL
  consultationType: varchar("consultationType", { length: 64 }), // 상담 타입 (saju, yuk, tarot)
  consultationContent: text("consultationContent"), // 상담 내용
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PurchasedTalisman = typeof purchasedTalismans.$inferSelect;
export type InsertPurchasedTalisman = typeof purchasedTalismans.$inferInsert;

// TODO: Add your tables here