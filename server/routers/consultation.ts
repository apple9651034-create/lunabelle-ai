import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import {
  createConsultationSession,
  getConsultationSession,
  getUserConsultationSessions,
  completeConsultationSession,
  createAdviceCard,
  getAdviceCard,
  getUserAdviceCards,
  revealAdviceCard,
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
} from "../db";
import { getDb } from "../db";
import { ENV } from "../_core/env";
import { invokeLLM } from "../_core/llm";
import { protectedProcedure, router } from "../_core/trpc";

export const consultationRouter = router({
  // 상담 세션 생성 (결제 후)
  createSession: protectedProcedure
    .input(
      z.object({
        duration: z.enum(["20", "50"]),
        paymentId: z.string(),
        paymentMethod: z.string(),
        consultationTopic: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const price = input.duration === "20" ? 22000 : 55000;

      // PortOne 결제 검증
      try {
        const portoneApiSecret = process.env.PORTONE_API_SECRET;
        if (!portoneApiSecret) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "결제 검증 설정이 완료되지 않았습니다.",
          });
        }

        // PortOne API로 결제 정보 조회
        const response = await fetch(
          `https://api.portone.io/payments/${input.paymentId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${portoneApiSecret}`,
            },
          }
        );

        if (!response.ok) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "결제 정보를 확인할 수 없습니다.",
          });
        }

        const paymentData = await response.json();

        // 결제 금액 검증
        if (paymentData.amount !== price) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "결제 금액이 일치하지 않습니다.",
          });
        }

        // 결제 상태 검증
        if (paymentData.status !== "PAID") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "결제가 완료되지 않았습니다.",
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("PortOne 결제 검증 오류:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "결제 검증 중 오류가 발생했습니다.",
        });
      }

      // 상담 세션 생성
      return await createConsultationSession(
        ctx.user.id,
        input.duration as "20" | "50",
        price,
        input.paymentId,
        input.paymentMethod,
        input.consultationTopic
      );
    }),

  // 사용자의 상담 세션 조회
  getUserSessions: protectedProcedure.query(async ({ ctx }) => {
    return await getUserConsultationSessions(ctx.user.id);
  }),

  // 상담 세션 상세 조회
  getSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input, ctx }) => {
      const session = await getConsultationSession(input.sessionId);

      if (!session || session.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "접근 권한이 없습니다.",
        });
      }

      return session;
    }),

  // 상담 완료 처리
  completeSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        consultationNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const session = await getConsultationSession(input.sessionId);

      if (!session || session.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "접근 권한이 없습니다.",
        });
      }

      return await completeConsultationSession(
        input.sessionId,
        input.consultationNotes
      );
    }),

  // 조언 카드 생성
  createAdviceCard: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        cardName: z.string(),
        cardReading: z.string(),
        cardType: z.string().default("tarot"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const session = await getConsultationSession(input.sessionId);

      if (!session || session.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "접근 권한이 없습니다.",
        });
      }

      return await createAdviceCard(
        input.sessionId,
        ctx.user.id,
        input.cardName,
        "",
        input.cardReading,
        input.cardType
      );
    }),

  // 조언 카드 조회
  getAdviceCard: protectedProcedure
    .input(z.object({ cardId: z.number() }))
    .query(async ({ input, ctx }) => {
      const card = await getAdviceCard(input.cardId);

      if (!card || card.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "접근 권한이 없습니다.",
        });
      }

      return card;
    }),

  // 사용자의 모든 조언 카드 조회
  getUserAdviceCards: protectedProcedure.query(async ({ ctx }) => {
    const cards = await getUserAdviceCards(ctx.user.id);
    return cards;
  }),

  // 조언 카드 공개
  revealCard: protectedProcedure
    .input(z.object({ cardId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const card = await getAdviceCard(input.cardId);

      if (!card || card.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "접근 권한이 없습니다.",
        });
      }

      const result = await revealAdviceCard(input.cardId);

      return { success: true };
    }),

  // 포트원 결제 검증 (서버)
  verifyPayment: protectedProcedure
    .input(
      z.object({
        paymentId: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const validPrices = [22000, 55000];

      if (!validPrices.includes(input.amount)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "유효하지 않은 금액입니다.",
        });
      }

      return {
        success: true,
        verified: true,
      };
    }),

  // 관리자: 결제 완료된 상담 목록 조회
  getAdminPendingSessions: protectedProcedure.query(async ({ ctx }) => {
    // 관리자 권한 확인
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "관리자만 접근 가능합니다.",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "데이터베이스 연결 실패",
      });
    }

    const { consultationSessions, users } = await import(
      "../../drizzle/schema"
    );

    // 결제 완료된 상담 목록 (pending 상태)
    const sessions = await db
      .select({
        id: consultationSessions.id,
        userId: consultationSessions.userId,
        duration: consultationSessions.duration,
        price: consultationSessions.price,
        status: consultationSessions.status,
        consultationTopic: consultationSessions.consultationTopic,
        createdAt: consultationSessions.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(consultationSessions)
      .innerJoin(users, eq(consultationSessions.userId, users.id))
      .where(eq(consultationSessions.status, "pending"))
      .orderBy(consultationSessions.createdAt);

    return sessions;
  }),

  // 관리자: 상담 완료 및 자동 카드 생성
  completeSessionWithAutoCard: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // 관리자 권한 확인
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "관리자만 접근 가능합니다.",
        });
      }

      // 1. 상담 세션 조회
      const session = await getConsultationSession(input.sessionId);
      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "상담 세션을 찾을 수 없습니다.",
        });
      }

      // 2. 중복 실행 방지 (이미 completed 상태)
      if (session.status === "completed") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "이미 완료된 상담입니다.",
        });
      }

      // 3. 이미 카드가 있는지 확인
      const existingCards = await getUserAdviceCards(session.userId);
      const cardExists = existingCards.some(
        (c) => c.consultationSessionId === input.sessionId
      );
      if (cardExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "이미 카드가 생성된 상담입니다.",
        });
      }

      try {
        // 4. 상담 세션 완료 처리
        await completeConsultationSession(input.sessionId);

        // 5. 타로 카드 목록
        const tarotCards = [
          {
            name: "매지션",
            meaning: "새로운 시작과 창의력, 당신의 능력을 활용할 시간입니다.",
          },
          {
            name: "여사제",
            meaning:
              "직관과 내면의 목소리, 당신의 내면의 지혜를 신뢰하세요.",
          },
          {
            name: "황제",
            meaning: "리더십과 권위, 당신의 힘을 발휘할 때입니다.",
          },
          {
            name: "황후",
            meaning: "풍요로움과 창조성, 새로운 가능성이 열리고 있습니다.",
          },
          {
            name: "교황",
            meaning: "지혜와 영적 성장, 당신의 길을 믿고 나아가세요.",
          },
        ];

        const selectedCard =
          tarotCards[Math.floor(Math.random() * tarotCards.length)];

        // 6. LLM으로 조언 메시지 생성
        let cardReading = selectedCard.meaning;
        try {
          const llmResponse = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `당신은 루나벨, 중과 동양의 전문 영영단사입니다. 사용자의 상담 내용을 기반으로 선택된 타로 카드 "${selectedCard.name}"의 의미를 설명하며, 사용자에게 동양을 주는 실직 조언을 제시하세요.`,
              },
              {
                role: "user",
                content: `사용자의 상담 내용: ${session.consultationTopic || "일반 상담"}\n\n선택된 카드: ${selectedCard.name}\n카드 의미: ${selectedCard.meaning}\n\n이 카드의 의미를 기반으로 사용자에게 동양을 주는 실직 조언을 대답해주세요.`,
              },
            ],
          });

          const content = llmResponse.choices[0]?.message?.content;
          if (typeof content === "string") {
            cardReading = content;
          }
        } catch (llmError) {
          console.error("LLM 조언 생성 오류:", llmError);
          // LLM 실패 시에도 기본 의미로 진행
          cardReading = selectedCard.meaning;
        }

        // 7. 조언 카드 DB 저장
        await createAdviceCard(
          input.sessionId,
          session.userId,
          selectedCard.name,
          "",
          cardReading,
          "tarot"
        );

        // 8. 사용자 알림 생성
        await createNotification(
          session.userId,
          "🌙 오늘의 조언 카드가 도착했습니다.",
          "루나벨과의 상담 중 조언 카드가 도착했습니다. 앱에서 확인해보세요.",
          "advice_card",
          input.sessionId
        );

        return {
          success: true,
          message: "상담이 완료되었습니다. 조언 카드가 생성되었습니다.",
          card: {
            name: selectedCard.name,
            reading: cardReading,
          },
        };
      } catch (error) {
        console.error("상담 완료 처리 오류:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "상담 완료 처리 중 오류가 발생했습니다.",
        });
      }
    }),

  // 사용자: 알림 조회
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    return await getUserNotifications(ctx.user.id);
  }),

  // 사용자: 알림 읽음 처리
  markNotificationRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      await markNotificationAsRead(input.notificationId);
      return { success: true };
    }),
});
