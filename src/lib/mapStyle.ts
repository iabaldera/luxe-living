export const categoryColor: Record<string, string> = {
  turismo: "#C9A96E",
  gastronomia: "#D9BE89",
  entretenimiento: "#A8874E",
  estancias: "#F8F5F0",
};

const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const CARTO_ATTR = `${OSM_ATTR} &copy; <a href="https://carto.com/attributions">CARTO</a>`;

export interface MapStyle {
  key: string;
  label: string;
  url: string;
  attribution: string;
  subdomains?: string[];
  maxZoom?: number;
}

export const MAP_STYLES: MapStyle[] = [
  {
    key: "dark",
    label: "Oscuro",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: CARTO_ATTR,
    subdomains: ["a", "b", "c", "d"],
    maxZoom: 19,
  },
  {
    key: "light",
    label: "Claro",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: CARTO_ATTR,
    subdomains: ["a", "b", "c", "d"],
    maxZoom: 19,
  },
  {
    key: "voyager",
    label: "Luxe",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: CARTO_ATTR,
    subdomains: ["a", "b", "c", "d"],
    maxZoom: 19,
  },
  {
    key: "osm",
    label: "Calles",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: OSM_ATTR,
    maxZoom: 19,
  },
  {
    key: "satellite",
    label: "Satélite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
  {
    key: "terrain",
    label: "Terreno",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: `${OSM_ATTR}, &copy; <a href="https://opentopomap.org">OpenTopoMap</a>`,
    subdomains: ["a", "b", "c"],
    maxZoom: 17,
  },
];

export const DEFAULT_STYLE = MAP_STYLES[0];

// Back-compat
export const TILE_URL = DEFAULT_STYLE.url;
export const TILE_ATTRIBUTION = DEFAULT_STYLE.attribution;
