import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler";
import { env } from "./config/env.config";
import { logger } from "./config/logger";

import authRoutes from "./routes/authRoutes";
import boardRoutes from "./routes/boardRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import commentRoutes from "./routes/commentRoutes";
import activityRoutes from "./routes/activityRoutes";
import attachmentRoutes from "./routes/attachmentRoutes";
import sprintRoutes from "./routes/sprintRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import * as commentController from "./controllers/commentController";
import * as attachmentController from "./controllers/attachmentController";
import { authenticateToken } from "./middlewares/authMiddleware";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

// Serving Uploaded Static Files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// DDoS Protection & Rate Limiting (Relaxed for development & SPA data fetching)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: env.NODE_ENV === 'production' ? 300 : 2000, // 2000 req saat dev agar bebas refresh
  message: {
    success: false,
    message: "Terlalu banyak request. Silakan coba beberapa saat lagi.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test', // Bypass saat testing
});
app.use(limiter);

// Logging HTTP Requests to winston
app.use(
  morgan("dev", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

app.get("/api/v1", (req, res) => {
  res.json({ success: true, message: "Welcome to Task API" });
});

// Define Core Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/boards", boardRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/sprints", sprintRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Sub-resource Routes for Task Comments, Activities, & Attachments
app.use("/api/v1/tasks/:taskId/comments", commentRoutes);
app.use("/api/v1/tasks/:taskId/activities", activityRoutes);
app.use("/api/v1/tasks/:taskId/attachments", attachmentRoutes);
app.use("/api/v1/projects/:projectId/analytics", analyticsRoutes);

// Direct Delete Routes
app.delete("/api/v1/comments/:id", authenticateToken as any, commentController.deleteComment as any);
app.delete("/api/v1/attachments/:id", authenticateToken as any, attachmentController.deleteAttachment as any);

// Handling Not Found
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

app.use(errorHandler);

export default app;
