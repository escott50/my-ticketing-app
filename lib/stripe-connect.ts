import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * Get the Stripe Connect account ID for an organizer (user_id = event creator).
 * Returns null if not connected or DB not configured.
 */
export async function getOrganizerStripeAccountId(
  userId: string
): Promise<string | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("organizer_stripe_accounts")
    .select("stripe_account_id")
    .eq("user_id", userId)
    .single();
  if (error || !data) return null;
  return data.stripe_account_id as string;
}

/**
 * Save or replace the Stripe Connect account ID for an organizer.
 */
export async function setOrganizerStripeAccount(
  userId: string,
  stripeAccountId: string
): Promise<{ error: string | null }> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return { error: "Database not configured" };
  }
  const { error } = await supabase
    .from("organizer_stripe_accounts")
    .upsert(
      { user_id: userId, stripe_account_id: stripeAccountId },
      { onConflict: "user_id" }
    );
  return { error: error?.message ?? null };
}
