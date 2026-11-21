import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/civil_db?schema=public"),
  DIRECT_URL: z.string().optional(),
  
  // Supabase Auth
  SUPABASE_URL: z.string().default("https://your-project.supabase.co"),
  SUPABASE_ANON_KEY: z.string().default("your-supabase-anon-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default("your-supabase-service-role-key"),
  SUPABASE_JWT_SECRET: z.string().default("your-supabase-jwt-secret"),

  // Cloudflare R2 (S3-Compatible)
  R2_ACCOUNT_ID: z.string().default("your-cloudflare-account-id"),
  R2_ACCESS_KEY_ID: z.string().default("your-r2-access-key-id"),
  R2_SECRET_ACCESS_KEY: z.string().default("your-r2-secret-access-key"),
  R2_BUCKET_NAME: z.string().default("civil-project-documents"),
  R2_PUBLIC_DOMAIN: z.string().optional(),

  // Resend Email
  RESEND_API_KEY: z.string().default("re_dummy_resend_key"),

  // Sentry
  SENTRY_DSN: z.string().optional(),

  // Client URL for CORS
  CLIENT_URL: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
