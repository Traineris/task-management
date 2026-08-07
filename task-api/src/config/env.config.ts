import { z } from "zod";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
dotenv.config({ path: envFile });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("8000"),
  CLIENT_URL: z.string().default("*"),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(1, "JWT_SECRET wajib diisi"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().default("onboarding@resend.dev"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Environment Variables not valid:", parsed.error.format());
    process.exit(1);
  }

  return parsed.data;
};

export const env = parseEnv();
