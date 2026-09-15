# Backend setup (Next.js + Prisma + custom users auth)

## Prerequisites

- Node 20+
- Postgres (Supabase project as host is fine — **Auth is not used**)

## Architecture

| Layer | Role |
|-------|------|
| **`users` table** | Email + password hash + role (app-managed) |
| **Session cookie** | HTTP-only JWT (`ce_session`) signed with `SESSION_SECRET` |
| **Prisma** | Typed server-side Postgres access (`DATABASE_URL`) |
| **SQL migrations** | Schema + optional RLS (`supabase/migrations/`) |
| **Supabase Storage** | Optional later for document files |

Prisma bypasses RLS — keep all Prisma usage in Server Actions / Route Handlers. Authorization uses `getCurrentUser()` / middleware role checks.

## 1. Install & env

```bash
npm install
cp .env.example .env
```

Required:

- `DATABASE_URL` — pooler (port **6543**, `?pgbouncer=true`)
- `DIRECT_URL` — direct (port **5432**)
- `SESSION_SECRET` — ≥32 random characters (`openssl rand -hex 32`)

Optional:

- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — create a staff user on seed
- `CRON_SECRET` — protect `/api/cron/nightly`

## 2. Apply schema

Preferred: apply SQL migrations in order (`01` … `08_users_auth.sql`), or:

```bash
npx prisma db push
node scripts/run-sql.js supabase/migrations/20260310000008_users_auth.sql
```

## 3. Generate client & seed

```bash
npm run prisma:generate
npm run seed:triggers
```

## 4. Run

```bash
npm run dev        # http://localhost:3000
npm test
```

Sign up at `/signup` (creates `users` + default workspace) or log in at `/login`.

## Auth APIs

- Server actions: `src/lib/actions/auth.ts` — `signUp`, `signIn`, `signOut`
- Session helpers: `src/lib/auth/session.ts`, `src/lib/auth/session-token.ts`
- Current user: `src/lib/auth/current-user.ts`
- Middleware role gates: `src/middleware.ts`

## Other APIs

- `POST /api/compliance/evaluate`
- Domain actions: `src/lib/actions/domain.ts`
- Matcher: `src/lib/compliance/matcher.ts`

## Route map

| Area | Path | Role |
|------|------|------|
| Marketing | `/` | public |
| Auth | `/login`, `/signup` | public |
| Client | `/dashboard/*` | `client_user` (staff also) |
| Admin | `/admin/*` | `staff` |
| Professional | `/professional/*` | `professional` (staff also) |
