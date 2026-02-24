-- Fix Comedy Night image URL (original Unsplash photo was removed/unavailable)
UPDATE public.events
SET image_url = 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80'
WHERE id = 'a0000001-0000-4000-8000-000000000004' AND title = 'Comedy Night';
