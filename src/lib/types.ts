export type Category = "turismo" | "gastronomia" | "entretenimiento";

export interface Property {
  id: string;
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
  foto: string;
  fotos: string[];
}

export interface Place {
  id: string;
  nombre: string;
  nombre_en: string;
  categoria: Category;
  subcategoria: string;
  descripcion: string;
  descripcion_en: string;
  lat: number;
  lng: number;
  foto: string;
  google_maps_url: string;
}
