import app from "./app";
import { env } from "./config/env.config";
import { logger } from "./config/logger";
import mongoose from "mongoose";

const PORT = env.PORT;

const startServer = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("📦 Database connected successfully");

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });

    // Enterprise Standard: Graceful Shutdown
    const shutdown = () => {
      logger.info("🛑 SIGTERM/SIGINT received. Shutting down gracefully...");
      server.close(() => {
        logger.info("💤 HTTP server closed");
        mongoose.connection.close();
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("💥 Failed to start server", error);
    process.exit(1);
  }
};

startServer();
