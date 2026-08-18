import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler";
import { env } from "./config/env.config";
import { logger } from "./config/logger";

import authRoutes from "./routes/authRoutes";
import boardRoutes from "./routes/boardRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

// DDoS Protection & Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minute
  max: 25,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
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

// Define Routes
// app.use('/api/v1/tasks', taskRoutes);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/boards", boardRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Handling Not Found
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

app.use(errorHandler);

export default app;
