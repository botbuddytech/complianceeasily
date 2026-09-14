# Run and deploy ComplianceEasily

AI-powered Indian business compliance platform — **Next.js (App Router) + TypeScript + Supabase**.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

Without Supabase credentials the UI runs on mock data. See [BACKEND.md](BACKEND.md) for full schema, seed, and API docs.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server (port 3000) |
| `npm run build` | Production build |
| `npm test` | Compliance engine + books unit tests |
| `npm run seed:triggers` | Seed `complianceTriggers.json` into Supabase |

## Portals

- `/` — marketing
- `/login`, `/signup` — auth
- `/dashboard/*` — client workspace
- `/admin/*` — ops console (triggers, filing queue, claims, catalogue)
- `/professional/*` — CA/CS/Advocate workspace

## Core product

The **compliance trigger system** (`src/lib/compliance/matcher.ts`) matches entity profiles to statutory obligations, materializes filings, and schedules reminders. Full design: see the backend plan and `BACKEND.md`.
