-- Store Stripe Connect (Express) account ID per organizer. Used for destination charges and payouts.
CREATE TABLE IF NOT EXISTS public.organizer_stripe_accounts (
  user_id uuid NOT NULL,
  stripe_account_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT organizer_stripe_accounts_pkey PRIMARY KEY (user_id),
  CONSTRAINT organizer_stripe_accounts_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES next_auth.users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT organizer_stripe_accounts_stripe_account_id_key UNIQUE (stripe_account_id)
);

GRANT ALL ON TABLE public.organizer_stripe_accounts TO postgres;
GRANT ALL ON TABLE public.organizer_stripe_accounts TO service_role;
