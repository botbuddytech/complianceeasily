# Run and deploy ComplianceEasily

AI-powered Indian business compliance platform — **Next.js (App Router) + TypeScript + Prisma** with **app-managed users auth** (Postgres via Supabase host optional).

## Quick start

```bash
npm install
cp .env.example .env
# set DATABASE_URL, DIRECT_URL, SESSION_SECRET
npm run prisma:generate
npm run seed:triggers
npm run dev
```

Open http://localhost:3000 — create an account at `/signup` or log in at `/login`.

See [BACKEND.md](BACKEND.md) for schema, auth, seed, and API docs.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server (port 3000) |
| `npm run build` | `prisma generate` + production build |
| `npm test` | Compliance engine + books unit tests |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run seed:triggers` | Seed trigger catalogue (+ optional admin user) |

## Portals

- `/` — marketing
- `/login`, `/signup` — email/password auth (`users` table)
- `/dashboard/*` — client workspace
- `/admin/*` — ops console
- `/professional/*` — CA/CS/Advocate workspace

## Core product

The **compliance trigger system** (`src/lib/compliance/matcher.ts`) matches entity profiles to statutory obligations, materializes filings, and schedules reminders. Full design: see `BACKEND.md`.
