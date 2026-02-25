import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "@/lib/auth";
import { getEventById } from "@/lib/events";
import { getOrganizerStripeAccountId } from "@/lib/stripe-connect";
import { createServerSupabaseClient } from "@/lib/supabase";

/** Bosh fee: 10% of face value + $0.99 per ticket. Attendee pays face + fee. */
function feePerTicketCents(facePriceDollars: number): number {
  return Math.round((facePriceDollars * 0.1 + 0.99) * 100);
}

/** Total attendee price per ticket in cents (face + fee). */
function unitAmountCents(facePriceDollars: number): number {
  return Math.round(facePriceDollars * 100) + feePerTicketCents(facePriceDollars);
}

/**
 * POST /api/checkout — create a Stripe Checkout Session or, for free events, create order and return success URL.
 * For paid events, organizer must have connected Stripe (destination charge: 10% + $0.99/ticket to Bosh, rest to organizer).
 * Body: { eventId: string, quantity?: number }
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to checkout" }, { status: 401 });
  }

  let body: { eventId?: string; quantity?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventId = body.eventId;
  const quantity = Math.max(1, body.quantity ?? 1);
  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  const event = await getEventById(eventId);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const totalFacePrice = event.price * quantity;

  // Free event: create order in Supabase and return success URL (no Stripe).
  if (totalFacePrice === 0) {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const { error } = await supabase.from("orders").insert({
      user_id: session.user.id,
      event_id: event.id,
      quantity,
      total_price: 0,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3001";
    return NextResponse.json({ success: true, url: `${base}/checkout/success?free=1&eventId=${eventId}` });
  }

  // Paid: organizer must have connected Stripe.
  const organizerAccountId = event.createdBy
    ? await getOrganizerStripeAccountId(event.createdBy)
    : null;
  if (!organizerAccountId) {
    return NextResponse.json(
      { error: "This event's organizer has not set up payments. Tickets are not available yet." },
      { status: 400 }
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const stripe = new Stripe(secretKey);
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3001";
  const applicationFeeCents = feePerTicketCents(event.price) * quantity;

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: event.title,
            description: `${event.date} · ${event.location}`,
            images: event.imageUrl ? [event.imageUrl] : undefined,
          },
          unit_amount: unitAmountCents(event.price),
        },
        quantity,
      },
    ],
    payment_intent_data: {
      application_fee_amount: applicationFeeCents,
      transfer_data: {
        destination: organizerAccountId,
      },
    },
    success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/checkout?eventId=${eventId}`,
    customer_email: session.user.email ?? undefined,
    metadata: {
      eventId: event.id,
      userId: session.user.id,
      quantity: String(quantity),
    },
  });

  return NextResponse.json({ url: stripeSession.url });
}
