-- Soft cancel for events: hide from Explore, show as cancelled on detail and in organizer.
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS cancelled_at timestamp with time zone;
