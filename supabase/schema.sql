-- Luxe Living — esquema Supabase
-- Ejecuta este archivo en el SQL editor de Supabase (una sola vez).

create extension if not exists "pgcrypto";

-- =========  PROPIEDADES  =========
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  nombre_en text not null,
  ubicacion text not null,
  ubicacion_en text not null,
  descripcion text not null default '',
  descripcion_en text not null default '',
  habitaciones int not null default 1,
  banos int not null default 1,
  huespedes int not null default 2,
  precio_noche numeric not null default 0,
  moneda text not null default 'USD',
  amenidades text[] not null default '{}',
  lat double precision,
  lng double precision,
  fotos text[] not null default '{}',
  activo boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========  LUGARES DEL MAPA  =========
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  nombre_en text not null,
  categoria text not null check (categoria in ('turismo','gastronomia','entretenimiento')),
  subcategoria text not null default '',
  descripcion text not null default '',
  descripcion_en text not null default '',
  lat double precision not null,
  lng double precision not null,
  foto text,
  google_maps_url text,
  activo boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========  REGLAS DEL CONDOMINIO  =========
create table if not exists public.rules (
  id uuid primary key default gen_random_uuid(),
  clave text unique not null,
  icono text not null default 'silencio',
  titulo text not null,
  titulo_en text not null,
  descripcion text not null,
  descripcion_en text not null,
  orden int not null default 0,
  activo boolean not null default true,
  updated_at timestamptz default now()
);

-- =========  CONFIGURACIÓN (contacto, etc.) =========
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into public.settings (key, value) values
  ('contact', '{"whatsapp":"18095550100","telegram":"luxelivingrd","email":"reservas@luxeliving.do","brand":"Luxe Living"}')
  on conflict (key) do nothing;

-- =========  RLS  =========
alter table public.properties enable row level security;
alter table public.places enable row level security;
alter table public.rules enable row level security;
alter table public.settings enable row level security;

-- lectura pública solo de registros activos
create policy "public read properties" on public.properties for select using (activo = true);
create policy "public read places" on public.places for select using (activo = true);
create policy "public read rules" on public.rules for select using (activo = true);
create policy "public read settings" on public.settings for select using (true);

-- escritura solo autenticados (dashboard admin)
create policy "auth write properties" on public.properties for all to authenticated using (true) with check (true);
create policy "auth write places" on public.places for all to authenticated using (true) with check (true);
create policy "auth write rules" on public.rules for all to authenticated using (true) with check (true);
create policy "auth write settings" on public.settings for all to authenticated using (true) with check (true);

-- =========  STORAGE  =========
-- Crea manualmente un bucket llamado "luxe-media" público desde la UI de Supabase Storage.
-- Luego pega estas policies en el bucket:
--   public read:  true
--   authenticated write:  true
