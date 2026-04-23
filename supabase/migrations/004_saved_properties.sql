-- Favoritos por usuario
create table if not exists saved_properties (
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

alter table saved_properties enable row level security;

drop policy if exists "own_select" on saved_properties;
create policy "own_select" on saved_properties
  for select using (auth.uid() = user_id);

drop policy if exists "own_insert" on saved_properties;
create policy "own_insert" on saved_properties
  for insert with check (auth.uid() = user_id);

drop policy if exists "own_delete" on saved_properties;
create policy "own_delete" on saved_properties
  for delete using (auth.uid() = user_id);
