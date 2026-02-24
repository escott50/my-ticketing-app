# Stripe setup (Bosh)

## 1. Run the orders migration (adds Stripe column)

In Supabase **SQL Editor**, run the contents of:

**`supabase/migrations/002_orders_stripe_session.sql`**

This adds `stripe_session_id` to `orders` so we can store the Stripe Checkout Session and avoid duplicate orders on refresh.

## 2. Stripe account and keys

1. Sign up at [stripe.com](https://stripe.com) and open the **Dashboard**.
2. Turn on **Test mode** (toggle in the sidebar) so you can use test cards.
3. Go to **Developers** → **API keys**.
4. Copy the **Secret key** (starts with `sk_test_` in test mode).
5. In your app’s **`.env.local`** add:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   ```

Restart the dev server after changing `.env.local`.

## 3. Flow

- **Checkout** (with an event selected): user must be signed in. Click **Pay with Stripe** (or **Claim free ticket** for $0 events).
- **Paid events:** app creates a Stripe Checkout Session and redirects to Stripe. After payment, Stripe redirects to `/checkout/success?session_id=...`. The success page verifies the payment and inserts an order into Supabase.
- **Free events:** app creates the order in Supabase immediately and redirects to the success page.

## 4. Stripe Connect (organizer payouts)

For paid events, funds go to the **organizer’s** Stripe account; Bosh keeps a fee (10% of face value + $0.99 per ticket).

1. In Stripe **Dashboard** → **Connect** → **Get started**, set up Connect (Express accounts are used).
2. Organizers go to **Organizer** in the app and click **Connect Stripe** to complete onboarding. Their Connect account ID is stored in `organizer_stripe_accounts`.
3. When an attendee pays for a paid event, the Checkout Session uses a **destination charge**: the platform receives the payment, keeps the application fee, and transfers the face value to the organizer’s connected account.

If an organizer has not connected Stripe, paid tickets for their events show an error at checkout (“organizer has not set up payments”).

## 5. Test cards (test mode)

Use [Stripe test cards](https://docs.stripe.com/testing#cards), e.g.:

- **4242 4242 4242 4242** — succeeds.
- Any future expiry, any CVC, any postal code.
