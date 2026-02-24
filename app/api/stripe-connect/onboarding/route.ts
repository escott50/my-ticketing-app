import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "@/lib/auth";
import { getOrganizerStripeAccountId, setOrganizerStripeAccount } from "@/lib/stripe-connect";

/**
 * POST /api/stripe-connect/onboarding
 * Creates or reuses a Stripe Express account for the current user and returns
 * an Account Link URL for onboarding. Redirect the user to this URL.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const stripe = new Stripe(secretKey);
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3001";
  const returnUrl = `${base}/organizer?stripe=complete`;
  const refreshUrl = `${base}/organizer?stripe=refresh`;

  let accountId = await getOrganizerStripeAccountId(session.user.id);

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
    });
    accountId = account.id;
    const { error } = await setOrganizerStripeAccount(session.user.id, accountId);
    if (error) {
      return NextResponse.json(
        { error: "Failed to save Stripe account" },
        { status: 500 }
      );
    }
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
