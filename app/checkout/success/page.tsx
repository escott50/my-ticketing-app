import Link from "next/link";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * Checkout success — after Stripe redirect (session_id) or free order (free=1).
 * For paid: verify Stripe session, then create order in Supabase.
 */
interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string; free?: string; eventId?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

  // Free order: already created in API. Just show success.
  if (params.free === "1") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-white mb-2">You&apos;re in!</h1>
        <p className="text-zinc-400 mb-8">
          Your free ticket is confirmed. Check your email if we sent a confirmation.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-white px-6 py-3.5 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          Back to events
        </Link>
      </main>
    );
  }

  const sessionId = params.session_id;
  if (!sessionId || !session?.user?.id) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-zinc-400 mb-8">
          Missing session or you&apos;re not signed in. If you just paid, your order may still have been recorded.
        </p>
        <Link href="/" className="text-white hover:text-zinc-300 underline">
          Back to events
        </Link>
      </main>
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-zinc-400">Stripe is not configured.</p>
      </main>
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (stripeSession.payment_status !== "paid") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-white mb-2">Payment not complete</h1>
        <p className="text-zinc-400 mb-8">
          Payment status: {stripeSession.payment_status}. If you paid, wait a moment and refresh.
        </p>
        <Link href="/" className="text-white hover:text-zinc-300 underline">
          Back to events
        </Link>
      </main>
    );
  }

  const eventId = stripeSession.metadata?.eventId;
  const quantity = parseInt(stripeSession.metadata?.quantity ?? "1", 10);
  const totalPrice = (stripeSession.amount_total ?? 0) / 100;

  if (!eventId) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-zinc-400">Missing event in session.</p>
      </main>
    );
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-zinc-400">Database not configured.</p>
      </main>
    );
  }

  // Insert order. If stripe_session_id already exists (user refreshed), that's ok.
  const { error } = await supabase.from("orders").insert({
    user_id: session.user.id,
    event_id: eventId,
    quantity,
    total_price: totalPrice,
    stripe_session_id: sessionId,
  });

  if (error) {
    if (error.code === "23505") {
      // Unique violation on stripe_session_id — order already created (e.g. user refreshed).
      // Fall through and show success.
    } else {
      return (
        <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <p className="text-zinc-400">Could not save order: {error.message}</p>
        </main>
      );
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-white mb-2">Payment successful</h1>
      <p className="text-zinc-400 mb-8">
        Thanks for your purchase. Your order is confirmed. Check your email for the receipt from Stripe.
      </p>
      <Link
        href="/"
        className="inline-block rounded-full bg-white px-6 py-3.5 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
      >
        Back to events
      </Link>
    </main>
  );
}
