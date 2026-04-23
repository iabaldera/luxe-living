import type { FC, SVGProps } from "react";

type Icon = FC<SVGProps<SVGSVGElement>>;

const svg = (path: React.ReactNode): Icon => (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    {path}
  </svg>
);

export interface AmenityDef {
  key: string;
  es: string;
  en: string;
  group: "essentials" | "wellness" | "kitchen" | "outdoor" | "work" | "family" | "security" | "services";
  Icon: Icon;
}

export const AMENITY_CATALOG: AmenityDef[] = [
  { key: "wifi", es: "WiFi", en: "WiFi", group: "essentials", Icon: svg(<><path d="M5 12a10 10 0 0 1 14 0M8 15a6 6 0 0 1 8 0"/><circle cx="12" cy="18" r="1"/></>) },
  { key: "ac", es: "A/C", en: "A/C", group: "essentials", Icon: svg(<><path d="M3 8h12a3 3 0 1 0 0-6M3 12h16a3 3 0 1 1 0 6M3 16h10"/></>) },
  { key: "calefaccion", es: "Calefacción", en: "Heating", group: "essentials", Icon: svg(<><path d="M12 3v18M6 7l-2 2 2 2M18 7l2 2-2 2M6 13l-2 2 2 2M18 13l2 2-2 2"/></>) },
  { key: "tv", es: "Smart TV", en: "Smart TV", group: "essentials", Icon: svg(<><rect x="3" y="5" width="18" height="12" rx="1"/><path d="M8 21h8M12 17v4"/></>) },
  { key: "lavadora", es: "Lavadora", en: "Washer", group: "essentials", Icon: svg(<><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="14" r="4"/><circle cx="8" cy="6" r=".6"/></>) },
  { key: "secadora", es: "Secadora", en: "Dryer", group: "essentials", Icon: svg(<><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="14" r="4"/><path d="M10 13s1-1 2 0 2-1 2-1"/></>) },
  { key: "sabanas", es: "Ropa de cama premium", en: "Premium linens", group: "essentials", Icon: svg(<><path d="M3 18V9a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9M3 15h18M3 18v2M21 18v2"/></>) },

  { key: "cocina", es: "Cocina equipada", en: "Full kitchen", group: "kitchen", Icon: svg(<><path d="M6 3v8a3 3 0 0 0 6 0V3M9 3v18M16 3c-1.5 2-2 4-2 6s.5 3 2 3v9"/></>) },
  { key: "cafetera", es: "Cafetera", en: "Coffee maker", group: "kitchen", Icon: svg(<><path d="M6 2h8v4H6zM6 6h8c0 4-1 6-4 6s-4-2-4-6zM10 14v4M6 20h8"/></>) },
  { key: "microondas", es: "Microondas", en: "Microwave", group: "kitchen", Icon: svg(<><rect x="3" y="6" width="18" height="12" rx="1"/><rect x="6" y="9" width="8" height="6"/><circle cx="18" cy="10" r=".6"/><circle cx="18" cy="14" r=".6"/></>) },
  { key: "nevera", es: "Nevera grande", en: "Full fridge", group: "kitchen", Icon: svg(<><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M5 11h14M8 6v2M8 14v2"/></>) },
  { key: "utensilios", es: "Utensilios básicos", en: "Cooking basics", group: "kitchen", Icon: svg(<><path d="M6 3v10a3 3 0 0 0 6 0V3M14 3c2 0 4 2 4 5s-2 5-4 5v7"/></>) },
  { key: "bbq", es: "BBQ", en: "BBQ", group: "kitchen", Icon: svg(<><path d="M4 7h16l-2 7H6L4 7zM8 14v4M16 14v4M10 5c0-1 2-1 2-3M14 5c0-1 2-1 2-3"/></>) },

  { key: "piscina", es: "Piscina", en: "Pool", group: "outdoor", Icon: svg(<><path d="M2 18c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1M8 14V6a2 2 0 0 1 4 0v8M12 10h4M16 14V6a2 2 0 0 0-4 0"/></>) },
  { key: "jacuzzi", es: "Jacuzzi", en: "Hot tub", group: "outdoor", Icon: svg(<><path d="M3 11h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7zM5 11V8a3 3 0 0 1 6 0M9 6c0-1 1-1 1-2s-1-1-1-2"/></>) },
  { key: "terraza", es: "Terraza", en: "Terrace", group: "outdoor", Icon: svg(<><path d="M3 10l9-6 9 6M5 10v10h14V10M9 20v-6h6v6"/></>) },
  { key: "jardin", es: "Jardín", en: "Garden", group: "outdoor", Icon: svg(<><path d="M12 20V8M12 8c0-3-3-5-5-3s-1 5 2 5h3zM12 8c0-3 3-5 5-3s1 5-2 5h-3zM4 20h16"/></>) },
  { key: "vista", es: "Vista panorámica", en: "Scenic view", group: "outdoor", Icon: svg(<><path d="M3 18l6-8 4 5 3-3 5 6zM7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></>) },
  { key: "parking", es: "Estacionamiento", en: "Parking", group: "outdoor", Icon: svg(<><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M10 17V8h3a2.5 2.5 0 0 1 0 5h-3"/></>) },

  { key: "gym", es: "Gimnasio", en: "Gym", group: "wellness", Icon: svg(<><path d="M3 9v6M7 6v12M17 6v12M21 9v6M7 12h10"/></>) },
  { key: "spa", es: "Spa", en: "Spa", group: "wellness", Icon: svg(<><path d="M12 3c0 4-4 5-4 9a4 4 0 0 0 8 0c0-4-4-5-4-9zM6 14c-2 2-2 6 0 6M18 14c2 2 2 6 0 6"/></>) },
  { key: "sauna", es: "Sauna", en: "Sauna", group: "wellness", Icon: svg(<><rect x="3" y="6" width="18" height="14" rx="1"/><path d="M7 10c1 1 1 2 0 3M11 10c1 1 1 2 0 3M15 10c1 1 1 2 0 3"/></>) },

  { key: "escritorio", es: "Escritorio", en: "Work desk", group: "work", Icon: svg(<><path d="M4 10h16v2H4zM5 12l-2 8M19 12l2 8M8 10V6h8v4"/></>) },
  { key: "wifi_rapido", es: "WiFi fibra óptica", en: "Fiber WiFi", group: "work", Icon: svg(<><path d="M2 12a14 14 0 0 1 20 0M6 15a8 8 0 0 1 12 0"/><circle cx="12" cy="18" r="1.2"/></>) },
  { key: "impresora", es: "Impresora", en: "Printer", group: "work", Icon: svg(<><path d="M6 9V3h12v6M4 9h16v8h-4v4H8v-4H4zM8 17h8"/></>) },

  { key: "cuna", es: "Cuna", en: "Crib", group: "family", Icon: svg(<><path d="M4 10h16v10H4zM4 10V6M20 10V6M8 10V6M12 10V6M16 10V6"/></>) },
  { key: "silla_bebe", es: "Silla para bebé", en: "High chair", group: "family", Icon: svg(<><path d="M7 21l1-9h8l1 9M9 12V7a3 3 0 0 1 6 0v5M8 16h8"/></>) },
  { key: "juegos", es: "Área de juegos", en: "Play area", group: "family", Icon: svg(<><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></>) },

  { key: "seguridad", es: "Seguridad 24/7", en: "24/7 security", group: "security", Icon: svg(<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></>) },
  { key: "camaras", es: "Cámaras exteriores", en: "Exterior cameras", group: "security", Icon: svg(<><circle cx="12" cy="12" r="3"/><rect x="3" y="7" width="14" height="10" rx="1"/><path d="M17 10l4-2v8l-4-2"/></>) },
  { key: "alarma", es: "Alarma", en: "Alarm", group: "security", Icon: svg(<><circle cx="12" cy="13" r="7"/><path d="M12 6V3M5 6L3 4M19 6l2-2M12 10v3l2 2"/></>) },
  { key: "caja_fuerte", es: "Caja fuerte", en: "Safe", group: "security", Icon: svg(<><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="14" cy="12" r="3"/><path d="M14 9v1M14 14v1M11 12h1M16 12h1"/></>) },
  { key: "detector_humo", es: "Detector de humo", en: "Smoke alarm", group: "security", Icon: svg(<><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2"/></>) },

  { key: "limpieza", es: "Limpieza incluida", en: "Cleaning included", group: "services", Icon: svg(<><path d="M19 8l-7 7-4-4M3 21h18"/></>) },
  { key: "desayuno", es: "Desayuno", en: "Breakfast", group: "services", Icon: svg(<><path d="M4 11h14a2 2 0 0 1 0 4h-1l-1 5H6l-1-5a2 2 0 0 1-1-2v-2zM18 11V8M8 7c0-1 1-1 1-2s-1-1-1-2M12 7c0-1 1-1 1-2s-1-1-1-2"/></>) },
  { key: "translado", es: "Traslado aeropuerto", en: "Airport transfer", group: "services", Icon: svg(<><path d="M2 12h20l-2 5H4zM6 12V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v5M6 17v2M18 17v2"/></>) },
  { key: "concierge", es: "Conserje", en: "Concierge", group: "services", Icon: svg(<><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></>) },
  { key: "mascotas_ok", es: "Admite mascotas", en: "Pet friendly", group: "services", Icon: svg(<><circle cx="6" cy="10" r="1.6"/><circle cx="10" cy="6" r="1.6"/><circle cx="14" cy="6" r="1.6"/><circle cx="18" cy="10" r="1.6"/><path d="M8 20c-2 0-3-1.5-3-3 0-2.5 3-3 4.5-5 1-1.3 2-2 2.5-2s1.5.7 2.5 2c1.5 2 4.5 2.5 4.5 5 0 1.5-1 3-3 3-1.5 0-2.5-1-4-1s-2.5 1-4 1z"/></>) },
];

export const AMENITY_MAP: Record<string, AmenityDef> = Object.fromEntries(
  AMENITY_CATALOG.map((a) => [a.key, a])
);

export const AMENITY_GROUPS: Array<{ key: AmenityDef["group"]; es: string; en: string }> = [
  { key: "essentials", es: "Esenciales", en: "Essentials" },
  { key: "kitchen", es: "Cocina", en: "Kitchen" },
  { key: "outdoor", es: "Al aire libre", en: "Outdoor" },
  { key: "wellness", es: "Bienestar", en: "Wellness" },
  { key: "work", es: "Trabajo", en: "Work" },
  { key: "family", es: "Familia", en: "Family" },
  { key: "security", es: "Seguridad", en: "Security" },
  { key: "services", es: "Servicios", en: "Services" },
];

export function amenityLabel(key: string, locale: string): string {
  const def = AMENITY_MAP[key];
  if (def) return locale === "en" ? def.en : def.es;
  return key.replace(/_/g, " ");
}

const Default: Icon = svg(<><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" /></>);
export function amenityIcon(key: string): Icon {
  return AMENITY_MAP[key]?.Icon ?? Default;
}
