# Supabase setup (Bosh)

This project uses Supabase for:

- **NextAuth** — The `@auth/supabase-adapter` stores users, sessions, and OAuth accounts in a `next_auth` schema so sign-in is backed by PostgreSQL.
- **Events** — The homepage and event detail pages read from `public.events`. The “Create event” form writes to this table (and sets `created_by` to the signed-in user).
- **Orders** — The `public.orders` table is ready for when you add Stripe; it links a user to an event and stores quantity and total.

---

## 1. Run the migration

1. Open your Supabase project → **SQL Editor** → **New query**.
2. Paste the contents of **supabase/migrations/001_initial_schema.sql** and run it.
3. Then run **supabase/seed_events.sql** to insert the 6 seed events.

## 2. Expose the NextAuth schema

So that the NextAuth adapter can read/write its tables:

1. Go to **Project Settings** (gear icon) → **API**.
2. Under **Exposed schemas**, add **next_auth** (if it’s not already listed). Save.

## 3. Environment variables

In `.env.local` add (get values from Supabase **Project Settings** → **API**):

- `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` — Project URL
- `SUPABASE_SERVICE_ROLE_KEY` — service_role key (secret; server-only)

The NextAuth adapter and your server-side Supabase client use these to talk to the database.
