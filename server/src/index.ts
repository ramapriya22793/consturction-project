import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Body Parsers & Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// API Routes
app.use("/api/v1", routes);

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Civil Project Backend listening on http://localhost:${PORT}`);
  console.log(`🔧 Mode: ${env.NODE_ENV}`);
  console.log(`🔐 Supabase Auth & PostgreSQL connected via Prisma`);
  console.log(`☁️ Cloudflare R2 S3 Object Storage configured for bucket: ${env.R2_BUCKET_NAME}`);
});

export default app;
