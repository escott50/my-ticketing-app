-- Optional: store Stripe Checkout Session ID on orders for reference and idempotency.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stripe_session_id text UNIQUE;
