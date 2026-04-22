import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? "https://jmmmskjsvjdqeiccpnkf.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) { console.error("Set SUPABASE_SERVICE_ROLE_KEY env var"); process.exit(1); }
const sb = createClient(url, key, { auth: { persistSession: false } });

const properties = [
  { slug:"penthouse-norte", nombre:"Penthouse Norte", nombre_en:"North Penthouse",
    ubicacion:"Cerros de Gurabo, Santiago", ubicacion_en:"Cerros de Gurabo, Santiago",
    descripcion:"Penthouse de 3 habitaciones con terraza privada, jacuzzi y vistas panorámicas al Monumento. Diseño minimalista en tonos neutros.",
    descripcion_en:"3-bedroom penthouse with private terrace, jacuzzi and panoramic Monument views. Minimalist design in neutral tones.",
    habitaciones:3, banos:3, huespedes:6, precio_noche:220, moneda:"USD",
    amenidades:["wifi","piscina","gym","parking","ac","cocina"],
    lat:19.4680, lng:-70.6820,
    fotos:["/images/propiedades/penthouse-norte-1.jpg","/images/propiedades/penthouse-norte-2.jpg","/images/propiedades/penthouse-norte-3.jpg"],
    activo:true },
  { slug:"villa-gurabo", nombre:"Villa Gurabo", nombre_en:"Villa Gurabo",
    ubicacion:"Gurabo, Santiago", ubicacion_en:"Gurabo, Santiago",
    descripcion:"Villa independiente con piscina privada, jardín tropical y 4 habitaciones. Ideal para familias o grupos que buscan privacidad.",
    descripcion_en:"Standalone villa with private pool, tropical garden and 4 bedrooms. Ideal for families or groups seeking privacy.",
    habitaciones:4, banos:4, huespedes:8, precio_noche:340, moneda:"USD",
    amenidades:["wifi","piscina","parking","ac","cocina","bbq"],
    lat:19.4620, lng:-70.6750,
    fotos:["/images/propiedades/villa-gurabo-1.jpg","/images/propiedades/villa-gurabo-2.jpg"],
    activo:true },
  { slug:"suite-monumento", nombre:"Suite Monumento", nombre_en:"Monument Suite",
    ubicacion:"Centro, Santiago", ubicacion_en:"Downtown, Santiago",
    descripcion:"Suite boutique de 1 habitación frente al Monumento. Perfecta para viajeros de negocios o escapadas románticas.",
    descripcion_en:"One-bedroom boutique suite facing the Monument. Perfect for business travelers or romantic getaways.",
    habitaciones:1, banos:1, huespedes:2, precio_noche:120, moneda:"USD",
    amenidades:["wifi","gym","ac","cocina"],
    lat:19.4517, lng:-70.6970,
    fotos:["/images/propiedades/suite-monumento-1.jpg","/images/propiedades/suite-monumento-2.jpg"],
    activo:true },
];

const places = [
  {slug:"monumento-heroes",nombre:"Monumento a los Héroes de la Restauración",nombre_en:"Monument to the Heroes of the Restoration",categoria:"turismo",subcategoria:"monumentos",descripcion:"Ícono de Santiago con vistas panorámicas de la ciudad.",descripcion_en:"Santiago's iconic monument with panoramic city views.",lat:19.4517,lng:-70.697,foto:"/images/lugares/monumento-heroes.jpg",google_maps_url:"https://maps.google.com/?q=Monumento+Santiago+Republica+Dominicana",activo:true},
  {slug:"parque-duarte",nombre:"Parque Duarte",nombre_en:"Duarte Park",categoria:"turismo",subcategoria:"parques",descripcion:"Plaza histórica en el corazón del centro, rodeada de arquitectura colonial.",descripcion_en:"Historic square at the city center, surrounded by colonial architecture.",lat:19.4498,lng:-70.6923,foto:"/images/lugares/parque-duarte.jpg",google_maps_url:"https://maps.google.com/?q=Parque+Duarte+Santiago",activo:true},
  {slug:"museo-tabaco",nombre:"Museo del Tabaco",nombre_en:"Tobacco Museum",categoria:"turismo",subcategoria:"museos",descripcion:"Descubre la historia del tabaco dominicano, patrimonio de Santiago.",descripcion_en:"Discover the history of Dominican tobacco, Santiago's heritage.",lat:19.4505,lng:-70.6918,foto:"/images/lugares/museo-tabaco.jpg",google_maps_url:"https://maps.google.com/?q=Museo+del+Tabaco+Santiago",activo:true},
  {slug:"centro-leon",nombre:"Centro León",nombre_en:"Centro León",categoria:"turismo",subcategoria:"museos",descripcion:"Centro cultural con arte dominicano contemporáneo y exposiciones temporales.",descripcion_en:"Cultural center featuring contemporary Dominican art and rotating exhibits.",lat:19.4675,lng:-70.7074,foto:"/images/lugares/centro-leon.jpg",google_maps_url:"https://maps.google.com/?q=Centro+Leon+Santiago",activo:true},
  {slug:"catedral-santiago",nombre:"Catedral de Santiago Apóstol",nombre_en:"Santiago Apostle Cathedral",categoria:"turismo",subcategoria:"monumentos",descripcion:"Catedral neoclásica del siglo XIX frente al Parque Duarte.",descripcion_en:"Nineteenth-century neoclassical cathedral facing Duarte Park.",lat:19.4492,lng:-70.6924,foto:"/images/lugares/catedral.jpg",google_maps_url:"https://maps.google.com/?q=Catedral+Santiago+Apostol",activo:true},
  {slug:"rancho-camaronero",nombre:"El Rancho Camaronero",nombre_en:"El Rancho Camaronero",categoria:"gastronomia",subcategoria:"restaurante-lujo",descripcion:"Alta cocina dominicana con énfasis en mariscos y ambiente elegante.",descripcion_en:"Upscale Dominican cuisine focused on seafood in an elegant setting.",lat:19.4588,lng:-70.6962,foto:"/images/lugares/camaronero.jpg",google_maps_url:"https://maps.google.com/?q=El+Rancho+Camaronero+Santiago",activo:true},
  {slug:"sakura-sushi",nombre:"Sakura Sushi Bar",nombre_en:"Sakura Sushi Bar",categoria:"gastronomia",subcategoria:"japones",descripcion:"Sushi y cocina japonesa contemporánea en ambiente íntimo.",descripcion_en:"Sushi and contemporary Japanese cuisine in an intimate setting.",lat:19.4601,lng:-70.7003,foto:"/images/lugares/sakura.jpg",google_maps_url:"https://maps.google.com/?q=Sakura+Sushi+Santiago",activo:true},
  {slug:"hacienda-mexicana",nombre:"Hacienda Mexicana",nombre_en:"Hacienda Mexicana",categoria:"gastronomia",subcategoria:"mexicano",descripcion:"Auténticos tacos, mezcales y platos tradicionales de México.",descripcion_en:"Authentic tacos, mezcal and traditional Mexican dishes.",lat:19.4562,lng:-70.6988,foto:"/images/lugares/hacienda.jpg",google_maps_url:"https://maps.google.com/?q=Hacienda+Mexicana+Santiago",activo:true},
  {slug:"arepas-bogota",nombre:"Arepas de Bogotá",nombre_en:"Arepas de Bogotá",categoria:"gastronomia",subcategoria:"colombiano",descripcion:"Cocina colombiana casera: arepas, bandeja paisa y más.",descripcion_en:"Home-style Colombian food: arepas, bandeja paisa and more.",lat:19.4544,lng:-70.695,foto:"/images/lugares/arepas.jpg",google_maps_url:"https://maps.google.com/?q=Arepas+Bogota+Santiago",activo:true},
  {slug:"cafe-monte",nombre:"Café del Monte",nombre_en:"Café del Monte",categoria:"gastronomia",subcategoria:"accesible",descripcion:"Café de especialidad, desayunos y almuerzos a buen precio.",descripcion_en:"Specialty coffee, breakfast and lunch at fair prices.",lat:19.4521,lng:-70.6935,foto:"/images/lugares/cafe-monte.jpg",google_maps_url:"https://maps.google.com/?q=Cafe+del+Monte+Santiago",activo:true},
  {slug:"kah-kow",nombre:"Kah Kow Experience",nombre_en:"Kah Kow Experience",categoria:"entretenimiento",subcategoria:"actividades",descripcion:"Tour interactivo del cacao dominicano con cata de chocolates.",descripcion_en:"Interactive Dominican cacao tour with chocolate tasting.",lat:19.4683,lng:-70.708,foto:"/images/lugares/kahkow.jpg",google_maps_url:"https://maps.google.com/?q=Kah+Kow+Experience+Santiago",activo:true},
  {slug:"alcazar-lounge",nombre:"Alcázar Rooftop Lounge",nombre_en:"Alcázar Rooftop Lounge",categoria:"entretenimiento",subcategoria:"vida-nocturna",descripcion:"Rooftop con cocteles de autor y vistas al Monumento.",descripcion_en:"Rooftop with signature cocktails and Monument views.",lat:19.4525,lng:-70.6977,foto:"/images/lugares/alcazar.jpg",google_maps_url:"https://maps.google.com/?q=Alcazar+Rooftop+Santiago",activo:true},
  {slug:"teatro-cibao",nombre:"Gran Teatro del Cibao",nombre_en:"Gran Teatro del Cibao",categoria:"entretenimiento",subcategoria:"eventos",descripcion:"Principal sala de conciertos, ópera y teatro de la región.",descripcion_en:"The region's main venue for concerts, opera and theater.",lat:19.4672,lng:-70.6886,foto:"/images/lugares/teatro.jpg",google_maps_url:"https://maps.google.com/?q=Gran+Teatro+del+Cibao",activo:true},
  {slug:"bolera-metro",nombre:"Metro Bowling",nombre_en:"Metro Bowling",categoria:"entretenimiento",subcategoria:"centros-diversion",descripcion:"Centro de entretenimiento familiar con boliche, arcade y billar.",descripcion_en:"Family entertainment center with bowling, arcade and billiards.",lat:19.4456,lng:-70.705,foto:"/images/lugares/bolera.jpg",google_maps_url:"https://maps.google.com/?q=Metro+Bowling+Santiago",activo:true},
  {slug:"ahi-bar",nombre:"Ahí Bar",nombre_en:"Ahí Bar",categoria:"entretenimiento",subcategoria:"vida-nocturna",descripcion:"Bar de coctelería clásica con música en vivo los fines de semana.",descripcion_en:"Classic cocktail bar with live music on weekends.",lat:19.4549,lng:-70.6992,foto:"/images/lugares/ahi.jpg",google_maps_url:"https://maps.google.com/?q=Ahi+Bar+Santiago",activo:true},
];

const rules = [
  {clave:"silencio",icono:"silencio",titulo:"Silencio nocturno",titulo_en:"Quiet hours",descripcion:"Desde las 10:00 p. m. hasta las 8:00 a. m. el volumen se mantiene bajo por respeto a los vecinos.",descripcion_en:"From 10:00 p.m. to 8:00 a.m. please keep noise to a minimum out of respect for neighbors.",orden:1,activo:true},
  {clave:"huespedes",icono:"huespedes",titulo:"Huéspedes autorizados",titulo_en:"Registered guests",descripcion:"Sólo las personas registradas en la reserva pueden pernoctar en la propiedad.",descripcion_en:"Only guests listed on the reservation may stay overnight.",orden:2,activo:true},
  {clave:"mascotas",icono:"mascotas",titulo:"Mascotas",titulo_en:"Pets",descripcion:"Las mascotas no están permitidas salvo autorización previa por escrito.",descripcion_en:"Pets are not allowed unless previously authorized in writing.",orden:3,activo:true},
  {clave:"fumar",icono:"fumar",titulo:"No fumar",titulo_en:"No smoking",descripcion:"La propiedad es libre de humo. Fumar sólo está permitido en áreas exteriores designadas.",descripcion_en:"This is a smoke-free property. Smoking is only allowed in designated outdoor areas.",orden:4,activo:true},
  {clave:"amenidades",icono:"amenidades",titulo:"Uso de amenidades",titulo_en:"Amenities",descripcion:"Piscina y gimnasio disponibles de 6:00 a. m. a 10:00 p. m. según reglamento del condominio.",descripcion_en:"Pool and gym open from 6:00 a.m. to 10:00 p.m. per building regulations.",orden:5,activo:true},
  {clave:"checkout",icono:"checkout",titulo:"Check-out",titulo_en:"Check-out",descripcion:"Check-out a las 11:00 a. m. Avísanos si necesitas una salida tardía.",descripcion_en:"Check-out at 11:00 a.m. Let us know if you need a late departure.",orden:6,activo:true},
];

const contact = { whatsapp:"18095551234", telegram:"luxelivingrd", email:"reservas@luxeliving.do", brand:"Luxe Living" };

async function run() {
  const r1 = await sb.from("properties").upsert(properties, { onConflict:"slug" });
  console.log("properties:", r1.error ?? "ok");
  const r2 = await sb.from("places").upsert(places, { onConflict:"slug" });
  console.log("places:", r2.error ?? "ok");
  const r3 = await sb.from("rules").upsert(rules, { onConflict:"clave" });
  console.log("rules:", r3.error ?? "ok");
  const r4 = await sb.from("settings").upsert({ key:"contact", value: contact }, { onConflict:"key" });
  console.log("settings:", r4.error ?? "ok");
}
run().catch(e => { console.error(e); process.exit(1); });
