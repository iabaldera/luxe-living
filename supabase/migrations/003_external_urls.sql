alter table public.properties
  add column if not exists airbnb_url text,
  add column if not exists booking_url text;
