alter table public.properties
  add column if not exists destacada boolean not null default false,
  add column if not exists orden_destacado int;

create index if not exists properties_destacada_idx on public.properties (destacada, orden_destacado);

notify pgrst, 'reload schema';
