-- Seed: 10 propiedades en Santiago de los Caballeros (idempotente).
-- Asegura primero que todas las columnas existan, luego inserta.

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
  add column if not exists video_url text,
  add column if not exists fotos_categorias text[] not null default '{}',
  add column if not exists airbnb_url text,
  add column if not exists booking_url text,
  add column if not exists icono text,
  add column if not exists icono_color text;

insert into public.properties (
  slug, nombre, nombre_en, ubicacion, ubicacion_en, descripcion, descripcion_en,
  habitaciones, banos, huespedes, precio_noche, moneda, amenidades,
  lat, lng, fotos, activo, tipo, piso, area_m2, camas, min_noches,
  check_in_hora, check_out_hora, destacados
) values
(
  'jardines-suite-dorada', 'Suite Dorada Los Jardines', 'Golden Jardines Suite',
  'Los Jardines Metropolitanos', 'Los Jardines Metropolitanos',
  'Suite elegante con vista panorámica a la ciudad, en el corazón de Los Jardines. Decoración contemporánea con acentos dorados.',
  'Elegant suite with panoramic city views in the heart of Los Jardines. Contemporary decor with golden accents.',
  2, 2, 4, 180, 'USD', array['wifi','ac','tv','parking','cocina_equipada','piscina','gimnasio','seguridad_24h'],
  19.4635, -70.6880, array[]::text[], true, 'apartamento', '8', 95, 2, 2,
  '15:00', '11:00', array['Vista a la ciudad','Balcón privado','Cocina gourmet']
),
(
  'trinitaria-penthouse', 'Penthouse La Trinitaria', 'La Trinitaria Penthouse',
  'La Trinitaria', 'La Trinitaria',
  'Penthouse de lujo con jacuzzi en terraza. Amplios espacios, luz natural y privacidad absoluta.',
  'Luxury penthouse with rooftop jacuzzi. Spacious rooms, natural light and absolute privacy.',
  3, 3, 6, 320, 'USD', array['wifi','ac','tv','parking','cocina_equipada','piscina','jacuzzi','terraza','seguridad_24h'],
  19.4700, -70.6825, array[]::text[], true, 'penthouse', '15', 180, 3, 3,
  '15:00', '11:00', array['Jacuzzi privado','Terraza 360°','Concierge']
),
(
  'gurabo-villa-boutique', 'Villa Boutique Gurabo', 'Gurabo Boutique Villa',
  'Gurabo', 'Gurabo',
  'Villa privada con piscina, rodeada de vegetación. Ideal para escapadas en pareja o familia.',
  'Private villa with pool surrounded by greenery. Ideal for couple or family getaways.',
  4, 3, 8, 420, 'USD', array['wifi','ac','tv','parking','cocina_equipada','piscina','jardin','bbq','seguridad_24h'],
  19.4420, -70.6340, array[]::text[], true, 'villa', null, 280, 5, 2,
  '16:00', '11:00', array['Piscina privada','BBQ','Jardín tropical']
),
(
  'cerros-gurabo-loft', 'Loft Moderno Cerros de Gurabo', 'Cerros de Gurabo Modern Loft',
  'Cerros de Gurabo', 'Cerros de Gurabo',
  'Loft minimalista de dos niveles con ventanales del piso al techo. Diseño industrial-luxe.',
  'Minimalist two-level loft with floor-to-ceiling windows. Industrial-luxe design.',
  1, 2, 3, 140, 'USD', array['wifi','ac','tv','parking','cocina_equipada','gimnasio','seguridad_24h'],
  19.4550, -70.6280, array[]::text[], true, 'loft', '3', 75, 1, 1,
  '15:00', '12:00', array['Diseño autor','Ventanales','Mezzanine']
),
(
  'bella-vista-suite', 'Suite Bella Vista Premium', 'Bella Vista Premium Suite',
  'Bella Vista', 'Bella Vista',
  'Apartamento premium cerca de centros comerciales y restaurantes. Perfecto para estancias de negocios.',
  'Premium apartment near malls and restaurants. Perfect for business stays.',
  2, 2, 4, 165, 'USD', array['wifi','ac','tv','parking','cocina_equipada','gimnasio','piscina','seguridad_24h','escritorio'],
  19.4540, -70.6900, array[]::text[], true, 'apartamento', '10', 110, 2, 1,
  '15:00', '11:00', array['Zona de negocios','Shopping cercano']
),
(
  'colinas-mall-estudio', 'Estudio Colinas Mall', 'Colinas Mall Studio',
  'Colinas Mall', 'Colinas Mall',
  'Estudio elegante junto a Colinas Mall. Ideal para viajeros solos o parejas.',
  'Elegant studio next to Colinas Mall. Ideal for solo travelers or couples.',
  1, 1, 2, 95, 'USD', array['wifi','ac','tv','parking','cocina_equipada','piscina','seguridad_24h'],
  19.4475, -70.6780, array[]::text[], true, 'estudio', '6', 45, 1, 1,
  '15:00', '11:00', array['Ubicación céntrica','Acceso a mall']
),
(
  'centro-historico-casa', 'Casa del Centro Histórico', 'Historic Downtown House',
  'Centro Histórico', 'Historic Downtown',
  'Casa colonial restaurada con lujo moderno. Pasos de la Catedral y el Centro de Arte.',
  'Colonial home restored with modern luxury. Steps from the Cathedral and Art Center.',
  3, 2, 6, 210, 'USD', array['wifi','ac','tv','cocina_equipada','patio','bbq','seguridad_24h'],
  19.4517, -70.6970, array[]::text[], true, 'casa', null, 160, 3, 2,
  '15:00', '11:00', array['Arquitectura colonial','Ubicación histórica','Patio interior']
),
(
  'universitario-suite', 'Suite Zona Universitaria', 'University Zone Suite',
  'Zona Universitaria PUCMM', 'PUCMM University Zone',
  'Suite moderna cerca de PUCMM. Ambiente tranquilo y seguro para estancias largas.',
  'Modern suite near PUCMM. Quiet and safe environment for extended stays.',
  2, 2, 4, 130, 'USD', array['wifi','ac','tv','parking','cocina_equipada','escritorio','lavadora','seguridad_24h'],
  19.4480, -70.6740, array[]::text[], true, 'apartamento', '5', 88, 2, 7,
  '15:00', '11:00', array['Larga estancia','Zona universitaria']
),
(
  'monumento-skyline', 'Skyline Monumento', 'Monumento Skyline',
  'Monumento', 'Monumento',
  'Apartamento de lujo con vista directa al Monumento. Acabados premium y diseño contemporáneo.',
  'Luxury apartment with direct view of the Monument. Premium finishes and contemporary design.',
  3, 3, 6, 260, 'USD', array['wifi','ac','tv','parking','cocina_equipada','piscina','gimnasio','jacuzzi','seguridad_24h'],
  19.4580, -70.6920, array[]::text[], true, 'apartamento', '20', 145, 3, 2,
  '15:00', '11:00', array['Vista al Monumento','Piso alto','Gimnasio']
),
(
  'villa-olga-retiro', 'Retiro Villa Olga', 'Villa Olga Retreat',
  'Villa Olga', 'Villa Olga',
  'Residencia amplia en zona residencial exclusiva. Jardín, piscina y total privacidad.',
  'Spacious residence in exclusive residential zone. Garden, pool and total privacy.',
  4, 4, 10, 480, 'USD', array['wifi','ac','tv','parking','cocina_equipada','piscina','jardin','bbq','lavadora','seguridad_24h','jacuzzi'],
  19.4450, -70.7020, array[]::text[], true, 'villa', null, 340, 6, 3,
  '16:00', '11:00', array['Residencial exclusivo','Piscina','10 huéspedes']
)
on conflict (slug) do update set
  nombre = excluded.nombre,
  nombre_en = excluded.nombre_en,
  ubicacion = excluded.ubicacion,
  ubicacion_en = excluded.ubicacion_en,
  descripcion = excluded.descripcion,
  descripcion_en = excluded.descripcion_en,
  habitaciones = excluded.habitaciones,
  banos = excluded.banos,
  huespedes = excluded.huespedes,
  precio_noche = excluded.precio_noche,
  amenidades = excluded.amenidades,
  lat = excluded.lat,
  lng = excluded.lng,
  activo = true,
  tipo = excluded.tipo,
  piso = excluded.piso,
  area_m2 = excluded.area_m2,
  camas = excluded.camas,
  min_noches = excluded.min_noches,
  destacados = excluded.destacados;

notify pgrst, 'reload schema';
