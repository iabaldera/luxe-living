-- Seed demo data for Luxe Living

-- Properties
insert into properties (slug, nombre, nombre_en, ubicacion, ubicacion_en, descripcion, descripcion_en, habitaciones, banos, huespedes, precio_noche, moneda, amenidades, lat, lng, fotos, activo) values
('penthouse-norte', 'Penthouse Norte', 'North Penthouse', 'Cerros de Gurabo, Santiago', 'Cerros de Gurabo, Santiago',
 'Penthouse de 3 habitaciones con terraza privada, jacuzzi y vistas panorámicas al Monumento. Diseño minimalista en tonos neutros.',
 '3-bedroom penthouse with private terrace, jacuzzi and panoramic Monument views. Minimalist design in neutral tones.',
 3, 3, 6, 220, 'USD',
 array['wifi','piscina','gym','parking','ac','cocina'],
 19.4680, -70.6820,
 array['/images/propiedades/penthouse-norte-1.jpg','/images/propiedades/penthouse-norte-2.jpg','/images/propiedades/penthouse-norte-3.jpg'],
 true),
('villa-gurabo', 'Villa Gurabo', 'Villa Gurabo', 'Gurabo, Santiago', 'Gurabo, Santiago',
 'Villa independiente con piscina privada, jardín tropical y 4 habitaciones. Ideal para familias o grupos que buscan privacidad.',
 'Standalone villa with private pool, tropical garden and 4 bedrooms. Ideal for families or groups seeking privacy.',
 4, 4, 8, 340, 'USD',
 array['wifi','piscina','parking','ac','cocina','bbq'],
 19.4620, -70.6750,
 array['/images/propiedades/villa-gurabo-1.jpg','/images/propiedades/villa-gurabo-2.jpg'],
 true),
('suite-monumento', 'Suite Monumento', 'Monument Suite', 'Centro, Santiago', 'Downtown, Santiago',
 'Suite boutique de 1 habitación frente al Monumento. Perfecta para viajeros de negocios o escapadas románticas.',
 'One-bedroom boutique suite facing the Monument. Perfect for business travelers or romantic getaways.',
 1, 1, 2, 120, 'USD',
 array['wifi','gym','ac','cocina'],
 19.4517, -70.6970,
 array['/images/propiedades/suite-monumento-1.jpg','/images/propiedades/suite-monumento-2.jpg'],
 true)
on conflict (slug) do nothing;

-- Places
insert into places (slug, nombre, nombre_en, categoria, subcategoria, descripcion, descripcion_en, lat, lng, foto, google_maps_url, activo) values
('monumento-heroes','Monumento a los Héroes de la Restauración','Monument to the Heroes of the Restoration','turismo','monumentos',
 'Ícono de Santiago con vistas panorámicas de la ciudad.','Santiago''s iconic monument with panoramic city views.',
 19.4517,-70.697,'/images/lugares/monumento-heroes.jpg','https://maps.google.com/?q=Monumento+Santiago+Republica+Dominicana',true),
('parque-duarte','Parque Duarte','Duarte Park','turismo','parques',
 'Plaza histórica en el corazón del centro, rodeada de arquitectura colonial.','Historic square at the city center, surrounded by colonial architecture.',
 19.4498,-70.6923,'/images/lugares/parque-duarte.jpg','https://maps.google.com/?q=Parque+Duarte+Santiago',true),
('museo-tabaco','Museo del Tabaco','Tobacco Museum','turismo','museos',
 'Descubre la historia del tabaco dominicano, patrimonio de Santiago.','Discover the history of Dominican tobacco, Santiago''s heritage.',
 19.4505,-70.6918,'/images/lugares/museo-tabaco.jpg','https://maps.google.com/?q=Museo+del+Tabaco+Santiago',true),
('centro-leon','Centro León','Centro León','turismo','museos',
 'Centro cultural con arte dominicano contemporáneo y exposiciones temporales.','Cultural center featuring contemporary Dominican art and rotating exhibits.',
 19.4675,-70.7074,'/images/lugares/centro-leon.jpg','https://maps.google.com/?q=Centro+Leon+Santiago',true),
('catedral-santiago','Catedral de Santiago Apóstol','Santiago Apostle Cathedral','turismo','monumentos',
 'Catedral neoclásica del siglo XIX frente al Parque Duarte.','Nineteenth-century neoclassical cathedral facing Duarte Park.',
 19.4492,-70.6924,'/images/lugares/catedral.jpg','https://maps.google.com/?q=Catedral+Santiago+Apostol',true),
('rancho-camaronero','El Rancho Camaronero','El Rancho Camaronero','gastronomia','restaurante-lujo',
 'Alta cocina dominicana con énfasis en mariscos y ambiente elegante.','Upscale Dominican cuisine focused on seafood in an elegant setting.',
 19.4588,-70.6962,'/images/lugares/camaronero.jpg','https://maps.google.com/?q=El+Rancho+Camaronero+Santiago',true),
('sakura-sushi','Sakura Sushi Bar','Sakura Sushi Bar','gastronomia','japones',
 'Sushi y cocina japonesa contemporánea en ambiente íntimo.','Sushi and contemporary Japanese cuisine in an intimate setting.',
 19.4601,-70.7003,'/images/lugares/sakura.jpg','https://maps.google.com/?q=Sakura+Sushi+Santiago',true),
('hacienda-mexicana','Hacienda Mexicana','Hacienda Mexicana','gastronomia','mexicano',
 'Auténticos tacos, mezcales y platos tradicionales de México.','Authentic tacos, mezcal and traditional Mexican dishes.',
 19.4562,-70.6988,'/images/lugares/hacienda.jpg','https://maps.google.com/?q=Hacienda+Mexicana+Santiago',true),
('arepas-bogota','Arepas de Bogotá','Arepas de Bogotá','gastronomia','colombiano',
 'Cocina colombiana casera: arepas, bandeja paisa y más.','Home-style Colombian food: arepas, bandeja paisa and more.',
 19.4544,-70.695,'/images/lugares/arepas.jpg','https://maps.google.com/?q=Arepas+Bogota+Santiago',true),
('cafe-monte','Café del Monte','Café del Monte','gastronomia','accesible',
 'Café de especialidad, desayunos y almuerzos a buen precio.','Specialty coffee, breakfast and lunch at fair prices.',
 19.4521,-70.6935,'/images/lugares/cafe-monte.jpg','https://maps.google.com/?q=Cafe+del+Monte+Santiago',true),
('kah-kow','Kah Kow Experience','Kah Kow Experience','entretenimiento','actividades',
 'Tour interactivo del cacao dominicano con cata de chocolates.','Interactive Dominican cacao tour with chocolate tasting.',
 19.4683,-70.708,'/images/lugares/kahkow.jpg','https://maps.google.com/?q=Kah+Kow+Experience+Santiago',true),
('alcazar-lounge','Alcázar Rooftop Lounge','Alcázar Rooftop Lounge','entretenimiento','vida-nocturna',
 'Rooftop con cocteles de autor y vistas al Monumento.','Rooftop with signature cocktails and Monument views.',
 19.4525,-70.6977,'/images/lugares/alcazar.jpg','https://maps.google.com/?q=Alcazar+Rooftop+Santiago',true),
('teatro-cibao','Gran Teatro del Cibao','Gran Teatro del Cibao','entretenimiento','eventos',
 'Principal sala de conciertos, ópera y teatro de la región.','The region''s main venue for concerts, opera and theater.',
 19.4672,-70.6886,'/images/lugares/teatro.jpg','https://maps.google.com/?q=Gran+Teatro+del+Cibao',true),
('bolera-metro','Metro Bowling','Metro Bowling','entretenimiento','centros-diversion',
 'Centro de entretenimiento familiar con boliche, arcade y billar.','Family entertainment center with bowling, arcade and billiards.',
 19.4456,-70.705,'/images/lugares/bolera.jpg','https://maps.google.com/?q=Metro+Bowling+Santiago',true),
('ahi-bar','Ahí Bar','Ahí Bar','entretenimiento','vida-nocturna',
 'Bar de coctelería clásica con música en vivo los fines de semana.','Classic cocktail bar with live music on weekends.',
 19.4549,-70.6992,'/images/lugares/ahi.jpg','https://maps.google.com/?q=Ahi+Bar+Santiago',true)
on conflict (slug) do nothing;

-- Rules
insert into rules (clave, icono, titulo, titulo_en, descripcion, descripcion_en, orden, activo) values
('silencio','silencio','Silencio nocturno','Quiet hours',
 'Desde las 10:00 p. m. hasta las 8:00 a. m. el volumen se mantiene bajo por respeto a los vecinos.',
 'From 10:00 p.m. to 8:00 a.m. please keep noise to a minimum out of respect for neighbors.',1,true),
('huespedes','huespedes','Huéspedes autorizados','Registered guests',
 'Sólo las personas registradas en la reserva pueden pernoctar en la propiedad.',
 'Only guests listed on the reservation may stay overnight.',2,true),
('mascotas','mascotas','Mascotas','Pets',
 'Las mascotas no están permitidas salvo autorización previa por escrito.',
 'Pets are not allowed unless previously authorized in writing.',3,true),
('fumar','fumar','No fumar','No smoking',
 'La propiedad es libre de humo. Fumar sólo está permitido en áreas exteriores designadas.',
 'This is a smoke-free property. Smoking is only allowed in designated outdoor areas.',4,true),
('amenidades','amenidades','Uso de amenidades','Amenities',
 'Piscina y gimnasio disponibles de 6:00 a. m. a 10:00 p. m. según reglamento del condominio.',
 'Pool and gym open from 6:00 a.m. to 10:00 p.m. per building regulations.',5,true),
('checkout','checkout','Check-out','Check-out',
 'Check-out a las 11:00 a. m. Avísanos si necesitas una salida tardía.',
 'Check-out at 11:00 a.m. Let us know if you need a late departure.',6,true)
on conflict (clave) do nothing;

-- Contact settings
insert into settings (key, value) values
('contact', jsonb_build_object(
   'whatsapp','18095551234',
   'telegram','luxelivingrd',
   'email','reservas@luxeliving.do',
   'brand','Luxe Living'
))
on conflict (key) do update set value = excluded.value;
