export interface PropertyRow {
  id: string;
  slug: string;
  nombre: string;
  nombre_en: string;
  ubicacion: string;
  ubicacion_en: string;
  descripcion: string;
  descripcion_en: string;
  habitaciones: number;
  banos: number;
  huespedes: number;
  precio_noche: number;
  moneda: string;
  amenidades: string[];
  lat: number | null;
  lng: number | null;
  fotos: string[];
  activo: boolean;
}

export interface PlaceRow {
  id: string;
  slug: string;
  nombre: string;
  nombre_en: string;
  categoria: "turismo" | "gastronomia" | "entretenimiento";
  subcategoria: string;
  descripcion: string;
  descripcion_en: string;
  lat: number;
  lng: number;
  foto: string | null;
  google_maps_url: string | null;
  activo: boolean;
}

export interface RuleRow {
  id: string;
  clave: string;
  icono: string;
  titulo: string;
  titulo_en: string;
  descripcion: string;
  descripcion_en: string;
  orden: number;
  activo: boolean;
}

export interface ContactSettings {
  whatsapp: string;
  telegram: string;
  email: string;
  brand: string;
  logo?: string | null;
  favicon?: string | null;
  assistantName?: string;
  assistantRole?: string;
  assistantRole_en?: string;
  assistantPhoto?: string | null;
  assistantGreeting?: string;
  assistantGreeting_en?: string;
}
