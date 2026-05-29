import * as Sentry from "@sentry/node";

const SENTRY_DSN = process.env.SENTRY_DSN || "";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
  });
  console.log("Sentry monitoring initialized successfully.");
} else {
  console.log("SENTRY_DSN not found. Sentry monitoring is disabled.");
}
