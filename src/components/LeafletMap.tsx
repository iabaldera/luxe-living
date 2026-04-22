"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TILE_URL, TILE_ATTRIBUTION, categoryColor } from "@/lib/mapStyle";
import type { PlaceRow as Place } from "@/lib/supabase/types";
import { useEffect } from "react";

const CENTER: [number, number] = [19.4517, -70.697];

function makeIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="28" height="36">
    <path d="M12 0C6 0 2 4 2 10c0 7 10 22 10 22s10-15 10-22c0-6-4-10-10-10z" fill="${color}" stroke="#0A0A0A" stroke-width="1"/>
    <circle cx="12" cy="10" r="3.2" fill="#0A0A0A"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "luxe-marker",
    iconSize: [28, 36],
    iconAnchor: [14, 34],
    popupAnchor: [0, -30],
  });
}

export default function LeafletMap({
  places,
  selected,
  onSelect,
  locale,
  t,
}: {
  places: Place[];
  selected: Place | null;
  onSelect: (p: Place | null) => void;
  locale: string;
  t: { openInMaps: string; cat: (k: string) => string };
}) {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .leaflet-container { background: #141414; font-family: var(--font-sans); }
      .leaflet-popup-content-wrapper { background: #F8F5F0; border-radius: 2px; box-shadow: 0 8px 24px -12px rgba(201,169,110,0.45); }
      .leaflet-popup-tip { background: #F8F5F0; }
      .leaflet-popup-content { margin: 14px; }
      .leaflet-control-attribution { background: rgba(20,20,20,0.7) !important; color: #8a8a8a !important; font-size: 10px !important; }
      .leaflet-control-attribution a { color: #C9A96E !important; }
      .leaflet-control-zoom a { background: #141414 !important; color: #C9A96E !important; border-color: #2a2a2a !important; }
      .luxe-marker { transition: transform 180ms cubic-bezier(0.22,1,0.36,1); }
      .luxe-marker:hover { transform: translateY(-2px) scale(1.06); }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <MapContainer center={CENTER} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl>
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} subdomains={["a", "b", "c", "d"]} />
      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={makeIcon(categoryColor[p.categoria])}
          eventHandlers={{ click: () => onSelect(p) }}
        >
          <Popup>
            <div style={{ width: 220 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A8874E", margin: 0 }}>
                {t.cat(p.categoria)}
              </p>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "#0A0A0A", margin: "4px 0 0" }}>
                {locale === "en" ? p.nombre_en : p.nombre}
              </h3>
              <p style={{ fontSize: 12, color: "#6B6B6B", margin: "6px 0 0", lineHeight: 1.4 }}>
                {locale === "en" ? p.descripcion_en : p.descripcion}
              </p>
              <a
                href={p.google_maps_url ?? `https://maps.google.com/?q=${p.lat},${p.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", marginTop: 10, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A8874E", borderBottom: "1px solid rgba(201,169,110,0.5)", paddingBottom: 2, textDecoration: "none" }}
              >
                {t.openInMaps} →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
