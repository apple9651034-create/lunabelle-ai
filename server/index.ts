import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { calculateFourPillars } from "manseryeok";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API: 사주 계산
  app.post("/api/saju", (req, res) => {
    try {
      const { year, month, day, hour, minute } = req.body;

      if (!year || !month || !day) {
        return res.status(400).json({ error: "생년월일이 필요합니다" });
      }

      const fourPillars = calculateFourPillars({
        year,
        month,
        day,
        hour: hour ?? 12,
        minute: minute ?? 0,
      });

      res.json(fourPillars);
    } catch (error) {
      console.error("사주 계산 오류:", error);
      res.status(500).json({ error: "사주 계산 중 오류가 발생했습니다" });
    }
  });

  // Handle client-side routing - serve index.html for all routes (마지막에 배치)
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`API available at http://localhost:${port}/api/saju`);
  });
}

startServer().catch(console.error);
