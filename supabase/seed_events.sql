-- =============================================================================
-- BOSH: Seed data for events (same as former mockData)
-- Run this in the Supabase SQL Editor AFTER running 001_initial_schema.sql.
-- created_by is NULL for seed events (no user created them in-app).
-- =============================================================================

INSERT INTO public.events (
  id,
  title,
  description,
  date,
  time,
  location,
  price,
  image_url,
  organizer
) VALUES
  (
    'a0000001-0000-4000-8000-000000000001',
    'Jazz Under the Stars',
    'An evening of live jazz in the park. Bring a blanket and enjoy smooth tunes as the sun sets.',
    '2025-03-15',
    '7:00 PM',
    'Riverside Park Amphitheater',
    25,
    'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80',
    'City Arts Council'
  ),
  (
    'a0000001-0000-4000-8000-000000000002',
    'Startup Pitch Night',
    'Watch 10 early-stage startups pitch to investors. Networking and drinks included.',
    '2025-03-22',
    '6:00 PM',
    'The Foundry, 123 Innovation Way',
    0,
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    'Tech Hub'
  ),
  (
    'a0000001-0000-4000-8000-000000000003',
    'Yoga & Brunch',
    'Morning flow followed by a healthy brunch. All levels welcome.',
    '2025-03-08',
    '9:00 AM',
    'Sunrise Studio, Downtown',
    35,
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    'Wellness Collective'
  ),
  (
    'a0000001-0000-4000-8000-000000000004',
    'Comedy Night',
    'Stand-up comedy with local and touring acts. 21+ with full bar.',
    '2025-03-28',
    '8:00 PM',
    'Laugh Factory',
    20,
    'https://images.unsplash.com/photo-1585699324551-f6c91c257c0f?w=800&q=80',
    'Laugh Factory'
  ),
  (
    'a0000001-0000-4000-8000-000000000005',
    'Craft Beer Festival',
    'Sample 50+ breweries. Live music, food trucks, and unlimited tastings.',
    '2025-04-05',
    '12:00 PM',
    'Harbor Pavilion',
    55,
    'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=800&q=80',
    'Brew Guild'
  ),
  (
    'a0000001-0000-4000-8000-000000000006',
    'Photography Workshop',
    'Learn portrait and street photography. Bring your camera or smartphone.',
    '2025-03-18',
    '2:00 PM',
    'Arts District Studio',
    75,
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    'Photo School'
  )
ON CONFLICT (id) DO NOTHING;
