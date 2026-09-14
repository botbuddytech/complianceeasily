# Backend setup (Next.js + Supabase)

## Prerequisites

- Node 20+
- A Supabase project (https://supabase.com)

## 1. Install & env

```bash
npm install
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Without these, the UI still runs on mock data (`isSupabaseConfigured()` returns false).

## 2. Apply migrations

In the Supabase SQL editor (or CLI), run in order:

1. `supabase/migrations/20260310000001_spine.sql`
2. `supabase/migrations/20260310000002_triggers.sql`
3. `supabase/migrations/20260310000003_documents.sql`
4. `supabase/migrations/20260310000004_books.sql`
5. `supabase/migrations/20260310000005_investments.sql`
6. `supabase/migrations/20260310000006_billing_admin.sql`
7. `supabase/migrations/20260310000007_rls.sql`

Or with CLI:

```bash
npx supabase db push
```

## 3. Seed the trigger catalogue

```bash
npm run seed:triggers
```

## 4. Run

```bash
npm run dev        # http://localhost:3000
npm test           # compliance engine + books render unit tests
```

## Key APIs

- `POST /api/compliance/evaluate` — `{ entityId, mode?: "evaluate" | "materialize" }`
- Server actions in `src/lib/actions/domain.ts` (entities, filings assign, documents, claims, notifications, staff invite, catalogue)
- Pure matcher: `src/lib/compliance/matcher.ts`
- Books render: `src/lib/books/render.ts`
- Notification stubs: `src/lib/notifications/providers.ts`

## Route map

| Area | Path |
|------|------|
| Marketing | `/` |
| Auth | `/login`, `/signup` |
| Client | `/dashboard/*` |
| Admin | `/admin/*` |
| Professional | `/professional/*` |
