import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  createConsultationSession,
  getConsultationSession,
  getUserConsultationSessions,
  completeConsultationSession,
  createAdviceCard,
  getAdviceCard,
  getUserAdviceCards,
  revealAdviceCard,
} from "../db";

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

      const result = await createConsultationSession(
        ctx.user.id,
        input.duration,
        price,
        input.paymentId,
        input.paymentMethod,
        input.consultationTopic
      );

      return {
        success: true,
        sessionId: (result as any).insertId || 0,
      };
    }),

  // 상담 세션 조회
  getSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input, ctx }) => {
      const session = await getConsultationSession(input.sessionId);

      if (!session || session.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return session;
    }),

  // 사용자의 모든 상담 세션 조회
  getUserSessions: protectedProcedure.query(async ({ ctx }) => {
    const sessions = await getUserConsultationSessions(ctx.user.id);
    return sessions;
  }),

  // 상담 완료 (관리자만)
  completeSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        consultationNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 관리자 확인
      if (ctx.user.role !== "admin") {
        throw new Error("Admin only");
      }

      const result = await completeConsultationSession(
        input.sessionId,
        input.consultationNotes
      );

      return { success: true };
    }),

  // 조언 카드 생성 (관리자만)
  createAdviceCard: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        cardName: z.string(),
        cardReading: z.string(),
        cardImage: z.string().optional(),
        cardType: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 관리자 확인
      if (ctx.user.role !== "admin") {
        throw new Error("Admin only");
      }

      const session = await getConsultationSession(input.sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      const result = await createAdviceCard(
        input.sessionId,
        session.userId,
        input.cardName,
        input.cardReading,
        input.cardImage,
        input.cardType
      );

      return {
        success: true,
        cardId: (result as any).insertId || 0,
      };
    }),

  // 조언 카드 조회
  getAdviceCard: protectedProcedure
    .input(z.object({ cardId: z.number() }))
    .query(async ({ input, ctx }) => {
      const card = await getAdviceCard(input.cardId);

      if (!card || card.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
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
        throw new Error("Unauthorized");
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
      // 실제 포트원 API 호출로 결제 검증
      // 여기서는 간단한 검증만 수행
      const validPrices = [22000, 55000];

      if (!validPrices.includes(input.amount)) {
        throw new Error("Invalid amount");
      }

      return {
        success: true,
        verified: true,
      };
    }),
});
