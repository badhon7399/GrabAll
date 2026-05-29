import * as Sentry from "@sentry/react";

const SENTRY_DSN = (import.meta.env.VITE_SENTRY_DSN as string) || "";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
  console.log("Sentry monitoring initialized successfully on frontend.");
} else {
  console.log("VITE_SENTRY_DSN not found. Sentry monitoring is disabled on frontend.");
}
