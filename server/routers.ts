import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "../shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const creditRouter = router({
  // 크레딧 잔액 조회
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const { getBalance } = await import("./db");
    return getBalance(ctx.user.id);
  }),

  // 크레딧 거래 내역 조회
  getTransactions: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const { getTransactions } = await import("./db");
      return getTransactions(ctx.user.id, input?.limit ?? 50);
    }),

  // 크레딧 차감 (상담 시 호출)
  deduct: protectedProcedure
    .input(z.object({
      amount: z.number().int().min(1),
      type: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { deductCredit, getBalance } = await import("./db");
      const balance = await getBalance(ctx.user.id);
      if (balance < input.amount) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient credits" });
      }
      await deductCredit(ctx.user.id, input.amount, input.type);
      return { success: true };
    }),

  // 크레딧 추가 (충전 시 호출)
  add: protectedProcedure
    .input(z.object({
      amount: z.number().int().min(1),
      type: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { addCredit } = await import("./db");
      await addCredit(ctx.user.id, input.amount, input.type, input.description);
      return { success: true };
    }),

  // PortOne 결제 검증 및 크레딧 적립
  chargeFromPortOne: protectedProcedure
    .input(z.object({
      paymentId: z.string(),
      amount: z.number().int().min(100),
      merchantUid: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const portOneApiKey = process.env.PORTONE_API_KEY;
        if (!portOneApiKey) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "PortOne API key not configured" });
        }

        // PortOne API로 결제 검증
        const portOneResponse = await fetch(`https://api.portone.io/payments/${input.paymentId}`, {
          headers: {
            'Authorization': `Bearer ${portOneApiKey}`,
          },
        });

        if (!portOneResponse.ok) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Payment verification failed" });
        }

        const payment = await portOneResponse.json();

        // 결제 상태 확인
        if (payment.status !== 'PAID') {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Payment not completed" });
        }

        // 금액 확인
        if (payment.amount.value !== input.amount) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Amount mismatch" });
        }

        // 크레딧 추가
        const { addCredit } = await import("./db");
        await addCredit(ctx.user.id, input.amount, 'charge', `PortOne Payment - ${input.paymentId}`);

        return { success: true, message: '충전이 완료되었습니다.' };
      } catch (error) {
        console.error('Payment verification error:', error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Payment processing failed" });
      }
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  credit: creditRouter,
});

export type AppRouter = typeof appRouter;
