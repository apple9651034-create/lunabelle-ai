import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

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

  // AI 채팅 API - 견고한 구현
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
      const forgeUrl = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
      const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

      if (!forgeUrl || !forgeKey) {
        console.error('[Chat API] LLM not configured. URL:', forgeUrl ? 'exists' : 'missing', 'Key:', forgeKey ? 'exists' : 'missing');
        return res.status(500).json({ error: 'LLM API not configured' });
      }

      console.log('[Chat API] Calling LLM with', messages.length, 'messages');

      // LLM API 호출
      const llmResponse = await fetch(`${forgeUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${forgeKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!llmResponse.ok) {
        const errorText = await llmResponse.text();
        console.error('[Chat API] LLM error:', llmResponse.status, errorText);
        return res.status(502).json({ error: 'LLM API error', details: errorText });
      }

      const data = await llmResponse.json();
      console.log('[Chat API] LLM response received');
      
      // 응답 형식 검증
      if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        console.error('[Chat API] Invalid response format:', data);
        return res.status(502).json({ error: 'Invalid LLM response format' });
      }

      return res.json(data);
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
