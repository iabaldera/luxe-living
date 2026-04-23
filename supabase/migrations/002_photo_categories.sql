alter table public.properties
  add column if not exists fotos_categorias text[] not null default '{}';
