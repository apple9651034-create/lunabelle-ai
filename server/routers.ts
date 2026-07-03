import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
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
