-- =============================================================================
-- BOSH: Initial schema for NextAuth + events + orders
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- After running, go to Project Settings → API and add "next_auth" to Exposed schemas.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. NextAuth schema and tables (users, sessions, accounts, verification_tokens)
-- The adapter stores sign-in data here. Users table is managed by the adapter.
-- -----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS next_auth;

GRANT USAGE ON SCHEMA next_auth TO service_role;
GRANT ALL ON SCHEMA next_auth TO postgres;

CREATE TABLE IF NOT EXISTS next_auth.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  email text,
  "emailVerified" timestamp with time zone,
  image text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT email_unique UNIQUE (email)
);

GRANT ALL ON TABLE next_auth.users TO postgres;
GRANT ALL ON TABLE next_auth.users TO service_role;

CREATE OR REPLACE FUNCTION next_auth.uid() RETURNS uuid
  LANGUAGE sql STABLE
  AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  expires timestamp with time zone NOT NULL,
  "sessionToken" text NOT NULL,
  "userId" uuid,
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessionToken_unique UNIQUE ("sessionToken"),
  CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES next_auth.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.sessions TO postgres;
GRANT ALL ON TABLE next_auth.sessions TO service_role;

CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  oauth_token_secret text,
  oauth_token text,
  "userId" uuid,
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT provider_unique UNIQUE (provider, "providerAccountId"),
  CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES next_auth.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.accounts TO postgres;
GRANT ALL ON TABLE next_auth.accounts TO service_role;

CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  identifier text,
  token text,
  expires timestamp with time zone NOT NULL,
  CONSTRAINT verification_tokens_pkey PRIMARY KEY (token),
  CONSTRAINT token_unique UNIQUE (token),
  CONSTRAINT token_identifier_unique UNIQUE (token, identifier)
);

GRANT ALL ON TABLE next_auth.verification_tokens TO postgres;
GRANT ALL ON TABLE next_auth.verification_tokens TO service_role;

-- -----------------------------------------------------------------------------
-- 2. Public schema: events table
-- created_by references the user who created the event (next_auth.users).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  date date NOT NULL,
  time text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  price numeric(10, 2) NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  organizer text NOT NULL DEFAULT '',
  created_by uuid,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT "events_created_by_fkey" FOREIGN KEY (created_by)
    REFERENCES next_auth.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE SET NULL
);

GRANT ALL ON TABLE public.events TO postgres;
GRANT ALL ON TABLE public.events TO service_role;
GRANT SELECT ON TABLE public.events TO anon;
GRANT ALL ON TABLE public.events TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. Public schema: orders table
-- Links a user to an event purchase (for when you add Stripe).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  total_price numeric(10, 2) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT "orders_user_id_fkey" FOREIGN KEY (user_id)
    REFERENCES next_auth.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
  CONSTRAINT "orders_event_id_fkey" FOREIGN KEY (event_id)
    REFERENCES public.events (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
);

GRANT ALL ON TABLE public.orders TO postgres;
GRANT ALL ON TABLE public.orders TO service_role;
GRANT SELECT, INSERT ON TABLE public.orders TO authenticated;
