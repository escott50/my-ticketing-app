import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. Uses the service role key so it can read/write
 * all tables (including next_auth and public.events / public.orders).
 * Use in API routes and Server Components only — never expose the service role key to the browser.
 * Returns null when env vars are missing (e.g. during build or before Supabase is configured).
 */
export function createServerSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
