import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// 크레딧 관련 함수들
export async function getBalance(userId: number): Promise<number> {
  // 로컬스토리지 기반 임시 구현 (실제는 DB에서 조회)
  return 10; // 기본 10 크레딧
}

export async function deductCredit(userId: number, amount: number, type: string): Promise<void> {
  // 크레딧 차감 로직
  console.log(`[Credit] User ${userId} deducted ${amount} credits for ${type}`);
}

export async function addCredit(userId: number, amount: number, type: string, description?: string): Promise<void> {
  // 크레딧 추가 로직
  console.log(`[Credit] User ${userId} added ${amount} credits for ${type}: ${description}`);
}

export async function getTransactions(userId: number, limit: number = 50): Promise<any[]> {
  // 거래 내역 조회
  return [];
}


// 루나벨 1:1 상담 관련 함수
import { consultationSessions, adviceCards } from "../drizzle/schema";
import { desc } from "drizzle-orm";

export async function createConsultationSession(
  userId: number,
  duration: "20" | "50",
  price: number,
  paymentId: string,
  paymentMethod: string,
  consultationTopic?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(consultationSessions).values({
    userId,
    duration,
    price,
    paymentId,
    paymentMethod,
    consultationTopic,
    status: "pending",
  });
  
  // 생성된 세션 조회 및 반환
  const createdSession = await db
    .select()
    .from(consultationSessions)
    .where(eq(consultationSessions.userId, userId))
    .orderBy((t) => t.createdAt)
    .limit(1);
  
  return createdSession[0] || null;
}

export async function getConsultationSession(sessionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select()
    .from(consultationSessions)
    .where(eq(consultationSessions.id, sessionId))
    .limit(1);
  return result[0];
}

export async function getUserConsultationSessions(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select()
    .from(consultationSessions)
    .where(eq(consultationSessions.userId, userId))
    .orderBy(desc(consultationSessions.createdAt));
  return result;
}

export async function completeConsultationSession(
  sessionId: number,
  consultationNotes?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .update(consultationSessions)
    .set({
      status: "completed",
      completedAt: new Date(),
      consultationNotes,
    })
    .where(eq(consultationSessions.id, sessionId));
  return result;
}

export async function createAdviceCard(
  consultationSessionId: number,
  userId: number,
  cardName: string,
  cardReading: string,
  cardImage?: string,
  cardType?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(adviceCards).values({
    consultationSessionId,
    userId,
    cardName,
    cardReading,
    cardImage,
    cardType: cardType || "tarot",
    isRevealed: false,
  });
  return result;
}

export async function getAdviceCard(cardId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select()
    .from(adviceCards)
    .where(eq(adviceCards.id, cardId))
    .limit(1);
  return result[0];
}

export async function getUserAdviceCards(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select()
    .from(adviceCards)
    .where(eq(adviceCards.userId, userId))
    .orderBy(desc(adviceCards.createdAt));
  return result;
}

export async function revealAdviceCard(cardId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .update(adviceCards)
    .set({ isRevealed: true })
    .where(eq(adviceCards.id, cardId));
  return result;
}

export async function getConsultationSessionWithCard(sessionId: number) {
  const session = await getConsultationSession(sessionId);
  if (!session) return null;

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const cards = await db
    .select()
    .from(adviceCards)
    .where(eq(adviceCards.consultationSessionId, sessionId));

  return {
    ...session,
    adviceCard: cards[0] || null,
  };
}

// 알림 함수들
export async function createNotification(
  userId: number,
  title: string,
  content: string,
  type: "advice_card" | "consultation_complete" | "general" = "general",
  consultationSessionId?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { notifications } = await import("../drizzle/schema");

  const result = await db.insert(notifications).values({
    userId,
    consultationSessionId: consultationSessionId || null,
    title,
    content,
    type,
    isRead: false,
  });

  return result;
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { notifications } = await import("../drizzle/schema");

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { notifications } = await import("../drizzle/schema");

  return await db
    .update(notifications)
    .set({
      isRead: true,
      readAt: new Date(),
    })
    .where(eq(notifications.id, notificationId));
}

export { consultationSessions, adviceCards } from "../drizzle/schema";
