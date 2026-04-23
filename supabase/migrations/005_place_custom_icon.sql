-- Personalización de iconos de lugares en el mapa
alter table if exists public.places add column if not exists icono text;
alter table if exists public.places add column if not exists icono_color text;

-- Personalización de icono por propiedad (marcador en el mapa)
alter table if exists public.properties add column if not exists icono text;
alter table if exists public.properties add column if not exists icono_color text;
