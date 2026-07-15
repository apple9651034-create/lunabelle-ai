import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { calculateYukHyo } from "../yukCalculator";
import { calculateIChing } from "../iChingCalculator";
import OpenAI from "openai";
import { ENV } from "./env";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);



  // AI 채팅 API - OpenAI 직접 호출
  app.post('/api/chat', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    try {
      const { messages } = req.body;
      
      // 입력 검증
      if (!messages || !Array.isArray(messages)) {
        console.error('[Chat API] Invalid messages format:', messages);
        return res.status(400).json({ error: 'Invalid messages format' });
      }

      if (messages.length === 0) {
        return res.status(400).json({ error: 'Messages array cannot be empty' });
      }

      // 환경 변수 확인
      const openaiKey = ENV.openaiApiKey;

      if (!openaiKey) {
        console.error('[Chat API] OpenAI API key not configured');
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      // OpenAI 클라이언트 초기화
      const openai = new OpenAI({ apiKey: openaiKey });

      console.log('[Chat API] Calling OpenAI with', messages.length, 'messages');

      // 리딩 타입 감지
      const systemMessage = messages.find((m: any) => m.role === 'system')?.content || '';
      const isIChing = systemMessage.includes('주역') || systemMessage.includes('변화의 흐름');
      const isYukHyo = systemMessage.includes('육효') && !isIChing;
      const isTarot = systemMessage.includes('타로') || systemMessage.includes('카드');
      const isSaju = systemMessage.includes('사주') || systemMessage.includes('명식');

      // 주역/육효 계산 엔진 통합
      let enhancedMessages = messages;
      
      if (isIChing) {
        // 주역 계산 엔진
        try {
          const userMessage = messages.find((m: any) => m.role === 'user')?.content || '';
          const iChingCalculation = calculateIChing(
            userMessage,
            { year: 2024, month: 7, day: 5, hour: 12, minute: 0 },
            { monthGanji: '을축', dayGanji: '정묘' }
          );
          
          // 주역 계산 결과를 프롬프트에 추가
          const calculationInfo = `
【주역 계산 결과】
본괘: ${iChingCalculation.benggwae.number}. ${iChingCalculation.benggwae.name} (${iChingCalculation.benggwae.meaning})
변괘: ${iChingCalculation.byeonggwae.number}. ${iChingCalculation.byeonggwae.name} (${iChingCalculation.byeonggwae.meaning})
동효: ${iChingCalculation.movingLines.join(', ')}

괘사: ${iChingCalculation.benggwae.guaSi}
변괘 괘사: ${iChingCalculation.byeonggwae.guaSi}

위 주역 계산 결과를 바탕으로 사용자의 질문에 답변하세요.`;
          
          // 시스템 메시지에 계산 결과 추가
          enhancedMessages = messages.map((m: any) => 
            m.role === 'system' ? { ...m, content: m.content + calculationInfo } : m
          );
        } catch (error) {
          console.error('[Chat API] IChing calculation error:', error);
          // 계산 실패해도 계속 진행
        }
      } else if (isYukHyo) {
        // 육효 계산 엔진
        try {
          const userMessage = messages.find((m: any) => m.role === 'user')?.content || '';
          const yukCalculation = calculateYukHyo(
            userMessage,
            { year: 2024, month: 7, day: 5, hour: 12, minute: 0 },
            { monthGanji: '을축', dayGanji: '정묘' }
          );
          
          // 계산 결과를 프롬프트에 추가
          const calculationInfo = `
【육효 계산 결과】
본괘: ${yukCalculation.benggwae.number}. ${yukCalculation.benggwae.name} (${yukCalculation.benggwae.meaning})
변괘: ${yukCalculation.byeonggwae.number}. ${yukCalculation.byeonggwae.name} (${yukCalculation.byeonggwae.meaning})
동효: ${yukCalculation.movingLines.join(', ')}효
용신: ${yukCalculation.yongsin}
원신: ${yukCalculation.wonsin}
기신: ${yukCalculation.gisin}
용신 왕쇠: ${yukCalculation.wangsoe}
월건: ${yukCalculation.monthGanji}, 일진: ${yukCalculation.dayGanji}
공망: ${yukCalculation.kongmang.join(', ') || '없음'}

각 효 분석:
${Object.entries(yukCalculation.yugjinAnalysis).map(([line, info]) => 
  `제${line}효: ${info.yinyang} - 육친: ${info.yugjin} - 오행: ${info.ohaeng}`
).join('\n')}

위 계산 결과를 바탕으로 사용자의 질문에 답변하세요.`;
          
          // 시스템 메시지에 계산 결과 추가
          enhancedMessages = messages.map((m: any) => 
            m.role === 'system' ? { ...m, content: m.content + calculationInfo } : m
          );
        } catch (error) {
          console.error('[Chat API] Yuk calculation error:', error);
          // 계산 실패해도 계속 진행
        }
      }

      // 리딩 타입별 최적화된 설정
      let model = 'gpt-4o';
      let temperature = 0.8;
      let max_tokens = 2000;

      if (isIChing) {
        temperature = 0.75;
        max_tokens = 2500;
      } else if (isYukHyo) {
        temperature = 0.75;
        max_tokens = 2500;
      } else if (isTarot) {
        temperature = 0.85;
        max_tokens = 2200;
      } else if (isSaju) {
        temperature = 0.7;
        max_tokens = 2300;
      }

      // OpenAI API 호출
      const data = await openai.chat.completions.create({
        model: model,
        messages: enhancedMessages as any,
        temperature: temperature,
        max_tokens: max_tokens,
      });

      console.log('[Chat API] OpenAI response received');
      
      // 응답 형식 검증
      if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        console.error('[Chat API] Invalid response format:', data);
        return res.status(502).json({ error: 'Invalid OpenAI response format' });
      }

      // OpenAI 응답을 기존 형식으로 변환
      const response = {
        choices: data.choices.map((choice: any) => ({
          message: {
            content: choice.message.content,
            role: choice.message.role,
          },
        })),
      };

      return res.json(response);
    } catch (error) {
      console.error('[Chat API] Error:', error instanceof Error ? error.message : error);
      return res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
