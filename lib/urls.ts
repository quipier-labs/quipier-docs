/**
 * Cross-service URLs by SaaS stage (local / dev / prod).
 * Defaults are PRODUCTION; .env.local (next dev) / .env.dev (deploy:dev) override.
 * NEXT_PUBLIC_* must use the literal key so Next can inline it at build.
 */
export const QUIPIER_URLS = {
  api: process.env.NEXT_PUBLIC_QUIPIER_API_BASE || "https://api.quipier.com",
  app: process.env.NEXT_PUBLIC_QUIPIER_APP_BASE || "https://app.quipier.com",
  passport:
    process.env.NEXT_PUBLIC_QUIPIER_PASSPORT_BASE || "https://passport.quipier.com",
  docs: process.env.NEXT_PUBLIC_QUIPIER_DOCS_BASE || "https://docs.quipier.com",
} as const;
