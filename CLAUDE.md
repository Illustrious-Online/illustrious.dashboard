# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `bun run dev` — start Next.js dev server (hot reload)
- `bun run build` — production build
- `bun run test` — run all tests with coverage (Vitest + jsdom)
- `bun run test:junit` — run tests with JUnit XML output (for CI)
- `bun run check` — Biome lint + format check on `./app`
- `bun run check:fix` — auto-fix Biome issues in `./app`
- Single test: `bunx vitest run app/auth/LoginForm.test.tsx`

## Architecture

Next.js 15 App Router application. Single repo (not a monorepo despite the `turbo` devDep — it's used for build caching only).

```
app/                  # Next.js App Router — pages, layouts, API routes
  api/                # Route handlers (Next.js API routes)
  auth/               # Auth pages (login, register, OAuth callbacks)
  profile/            # User profile pages
  components/         # (none here — shared UI is in app/components or lib/)
lib/
  auth/               # better-auth client config
  supabase/           # Supabase client (browser + server + middleware helpers)
middleware.ts         # Next.js middleware — Supabase session refresh + route guards
middleware.test.ts    # Tests for middleware
services/
  userService.ts      # Business logic (DB / API calls — no Next.js deps)
types/                # Global TypeScript type declarations
k8s/                  # Kubernetes manifests
public/               # Static assets
setupTests.ts         # Vitest global setup (jest-dom matchers)
vitest.config.mts     # Vitest config — jsdom environment, tsconfigPaths plugin
```

### Auth

- **Supabase** handles sessions; client is in `lib/supabase/` with separate browser, server, and middleware helpers
- `middleware.ts` calls `createClient` from `lib/supabase/server` and protects all routes not in `PUBLIC_PATHS`
- **Steam OAuth** is supported — Steam callback routes live under `app/auth/`
- Never use `console.log` — Sentry (`@sentry/nextjs`) handles error capture

### Forms

- **Formik** + **formik-validator-zod** for form state and validation
- Zod schemas define the validation rules; Formik manages field state and submission

### Testing

- **Vitest** with `jsdom` environment — not `bun test`
- `@testing-library/react` + `@testing-library/user-event` for component tests
- Tests are co-located with the code they test (`.test.tsx` next to the component)
- `setupTests.ts` imports `@testing-library/jest-dom` for DOM matchers
- Coverage excludes `.next/`, Sentry config, `lib/supabase/`, and layouts

## Conventions

- Biome for lint + format — only runs on `./app` (not `lib/`, `services/`, `middleware.ts`)
- Husky pre-commit hook runs lint-staged (Biome on staged files)
- All environment variables must be accessed via `@next/env` or `process.env` at the module boundary — never pass raw `process.env` strings into shared utilities
- Releases managed by semantic-release on `main` and `next` branches
- Never commit secrets or `.env` files — use Sealed Secrets for K8s deployments
