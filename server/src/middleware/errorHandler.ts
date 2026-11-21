import { Request, Response, NextFunction } from "express";
import * as Sentry from "@sentry/node";
import { env } from "../config/env";

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
  });
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("[ServerError]:", err);

  if (env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: message,
    ...(env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};
