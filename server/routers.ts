import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "../shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { consultationRouter } from "./routers/consultation";

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
      credits: z.number().int().min(1).optional(), // 추가: 단순 금액이 아닌 크레딧 수량
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

        // 크레딧 추가 (진짜 단위: 크레딧 수, 단위: 원)
        const { addCredit } = await import("./db");
        const creditAmount = input.credits || Math.floor(input.amount / 1000); // 기본값: 1000원 = 1크레딧
        await addCredit(ctx.user.id, creditAmount, 'charge', `PortOne Payment - ${input.paymentId}`);
        
        return { success: true, message: '충전이 완료되었습니다.', creditsAdded: creditAmount };


      } catch (error) {
        console.error('Payment verification error:', error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Payment processing failed" });
      }
    }),
});

const chatRouter = router({
  // 육효 상담
  consultYuk: protectedProcedure
    .input(z.object({
      message: z.string(),
      consultationType: z.string().optional(),
      previousContext: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { invokeLLM } = await import("./_core/llm");
        
        const systemPrompt = `당신은 AI 루나, 고대의 지혜인 육효 상담 전문가입니다.
사용자의 질문에 대해 육효의 64개 괘(卦)와 변화하는 효(爻)를 기반으로 깊이 있는 상담을 제공합니다.
항상 사용자를 "달빛님"이라고 부르고, 따뜻하고 신비로운 톤으로 답변하세요.
육효의 지혜를 통해 현명한 조언을 제공하되, 실제 괘의 의미를 반영하세요.`;

        const messages = [
          { role: 'system' as const, content: systemPrompt },
          ...(input.previousContext ? [{ role: 'user' as const, content: `이전 상담 맥락: ${input.previousContext}` }] : []),
          { role: 'user' as const, content: input.message },
        ];

        const response = await invokeLLM({
          messages,
          model: 'claude-opus',
        });

        const responseText = response.choices[0]?.message?.content || '죄송합니다. 응답을 생성할 수 없습니다.';

        return {
          response: responseText,
          type: 'yuk',
        };
      } catch (error) {
        console.error('Yuk consultation error:', error);
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "맞춤형 운세 서비스 이용 불가" 
        });
      }
    }),

  // 사주 상담
  consultSaju: protectedProcedure
    .input(z.object({
      message: z.string(),
      consultationType: z.string().optional(),
      previousContext: z.string().optional(),
      chart: z.string().optional(), // 명식: "정사 / 정미 / 정축 / 갑진"
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { invokeLLM } = await import("./_core/llm");
        const { parseSajuChart } = await import("./sajuParser");
        const { generateSajuAnalysisPrompt } = await import("./sajuAnalysisPrompt");
        
        // 명식 파싱
        let systemPrompt = "";
        if (input.chart) {
          const parsed = parseSajuChart(input.chart);
          if (parsed) {
            systemPrompt = generateSajuAnalysisPrompt(parsed, input.message);
          } else {
            systemPrompt = "죄송합니다. 명식을 파싱할 수 없습니다. 명식을 다시 확인해주세요.";
          }
        } else {
          systemPrompt = "당신은 AI 루나, 사주 상담가입니다. 사용자의 질문에 따뜻하고 신비로운 톤으로 답변하세요.";
        }

        const messages = [
          { role: 'system' as const, content: systemPrompt },
          ...(input.previousContext ? [{ role: 'user' as const, content: `이전 상담 맥락: ${input.previousContext}` }] : []),
          { role: 'user' as const, content: input.message },
        ];

        const response = await invokeLLM({
          messages,
          model: 'claude-opus',
        });

        const responseText = response.choices[0]?.message?.content || '죄송합니다. 응답을 생성할 수 없습니다.';

        return {
          response: responseText,
          type: 'saju',
        };
      } catch (error) {
        console.error('Saju consultation error:', error);
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "맞춤형 운세 서비스 이용 불가" 
        });
      }
    }),

  // 타로 상담
  consultTarot: protectedProcedure
    .input(z.object({
      message: z.string(),
      consultationType: z.string().optional(),
      previousContext: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { invokeLLM } = await import("./_core/llm");
        
        const systemPrompt = `당신은 AI 루나, 타로 상담 전문가입니다.
사용자의 질문에 대해 타로 카드의 의미와 해석을 기반으로 깊이 있는 상담을 제공합니다.
항상 사용자를 "달빛님"이라고 부르고, 따뜻하고 신비로운 톤으로 답변하세요.
타로의 지혜를 통해 현명한 조언을 제공하세요.`;

        const messages = [
          { role: 'system' as const, content: systemPrompt },
          ...(input.previousContext ? [{ role: 'user' as const, content: `이전 상담 맥락: ${input.previousContext}` }] : []),
          { role: 'user' as const, content: input.message },
        ];

        const response = await invokeLLM({
          messages,
          model: 'claude-opus',
        });

        const responseText = response.choices[0]?.message?.content || '죄송합니다. 응답을 생성할 수 없습니다.';

        return {
          response: responseText,
          type: 'tarot',
        };
      } catch (error) {
        console.error('Tarot consultation error:', error);
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "맞춤형 운세 서비스 이용 불가" 
        });
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
  chat: chatRouter,
  consultation: consultationRouter,
});

export type AppRouter = typeof appRouter;
