-- Campos adicionales para propiedades (detalles para el cliente).
-- Ejecuta este archivo en el SQL editor de Supabase.

alter table public.properties
  add column if not exists tipo text,
  add column if not exists piso text,
  add column if not exists area_m2 numeric,
  add column if not exists camas int,
  add column if not exists min_noches int,
  add column if not exists check_in_hora text,
  add column if not exists check_out_hora text,
  add column if not exists destacados text[] not null default '{}',
  add column if not exists politica_cancelacion text,
  add column if not exists politica_cancelacion_en text,
  add column if not exists wifi_nombre text,
  add column if not exists wifi_clave text,
  add column if not exists codigo_acceso text,
  add column if not exists video_url text;
