"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TILE_URL, TILE_ATTRIBUTION, categoryColor } from "@/lib/mapStyle";
import type { PlaceRow as Place, PropertyRow } from "@/lib/supabase/types";
import { useEffect } from "react";

const CENTER: [number, number] = [19.4517, -70.697];

function makeIcon(color: string, isProperty = false) {
  const svg = isProperty
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="34" height="42">
        <path d="M16 0C8 0 2 6 2 14c0 10 14 26 14 26s14-16 14-26c0-8-6-14-14-14z" fill="${color}" stroke="#C9A96E" stroke-width="2"/>
        <path d="M10 16l6-5 6 5v7a1 1 0 0 1-1 1h-3v-4h-4v4h-3a1 1 0 0 1-1-1z" fill="#0A0A0A"/>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="28" height="36">
        <path d="M12 0C6 0 2 4 2 10c0 7 10 22 10 22s10-15 10-22c0-6-4-10-10-10z" fill="${color}" stroke="#0A0A0A" stroke-width="1"/>
        <circle cx="12" cy="10" r="3.2" fill="#0A0A0A"/>
      </svg>`;
  return L.divIcon({
    html: svg,
    className: "luxe-marker",
    iconSize: isProperty ? [34, 42] : [28, 36],
    iconAnchor: isProperty ? [17, 40] : [14, 34],
    popupAnchor: [0, -30],
  });
}

export default function LeafletMap({
  places,
  properties = [],
  selected,
  onSelect,
  locale,
  t,
}: {
  places: Place[];
  properties?: PropertyRow[];
  selected: Place | null;
  onSelect: (p: Place | null) => void;
  locale: string;
  t: { openInMaps: string; cat: (k: string) => string; viewProperty?: string };
}) {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .leaflet-container { background: #141414; font-family: var(--font-sans); }
      .leaflet-popup-content-wrapper { background: #F8F5F0; border-radius: 2px; box-shadow: 0 8px 24px -12px rgba(201,169,110,0.45); padding: 0; overflow: hidden; }
      .leaflet-popup-content { margin: 0; width: 240px !important; }
      .leaflet-popup-tip { background: #F8F5F0; }
      .leaflet-control-attribution { background: rgba(20,20,20,0.7) !important; color: #8a8a8a !important; font-size: 10px !important; }
      .leaflet-control-attribution a { color: #C9A96E !important; }
      .leaflet-control-zoom a { background: #141414 !important; color: #C9A96E !important; border-color: #2a2a2a !important; }
      .luxe-marker { transition: transform 180ms cubic-bezier(0.22,1,0.36,1); }
      .luxe-marker:hover { transform: translateY(-2px) scale(1.06); z-index: 1000 !important; }
      .luxe-popup-img { width: 100%; height: 120px; background-size: cover; background-position: center; background-color: #2a2a2a; }
      .luxe-popup-body { padding: 12px 14px 14px; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <MapContainer center={CENTER} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl={false}>
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} subdomains={["a", "b", "c", "d"]} />

      {places.map((p) => (
        <Marker
          key={`place-${p.id}`}
          position={[p.lat, p.lng]}
          icon={makeIcon(categoryColor[p.categoria])}
          eventHandlers={{ click: () => onSelect(p) }}
        >
          <Popup>
            <div>
              {p.foto && <div className="luxe-popup-img" style={{ backgroundImage: `url('${p.foto}')` }} />}
              <div className="luxe-popup-body">
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
            </div>
          </Popup>
        </Marker>
      ))}

      {properties.filter((p) => p.lat != null && p.lng != null).map((p) => {
        const cover = p.fotos?.[0];
        return (
          <Marker
            key={`prop-${p.id}`}
            position={[p.lat as number, p.lng as number]}
            icon={makeIcon(categoryColor.estancias, true)}
          >
            <Popup>
              <div>
                {cover && <div className="luxe-popup-img" style={{ backgroundImage: `url('${cover}')`, height: 140 }} />}
                <div className="luxe-popup-body">
                  <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A8874E", margin: 0 }}>
                    {locale === "en" ? "Stay" : "Estancia"}
                  </p>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "#0A0A0A", margin: "4px 0 0" }}>
                    {locale === "en" ? p.nombre_en : p.nombre}
                  </h3>
                  <p style={{ fontSize: 11, color: "#6B6B6B", margin: "4px 0 6px" }}>
                    {locale === "en" ? p.ubicacion_en : p.ubicacion}
                  </p>
                  <p style={{ fontSize: 13, color: "#0A0A0A", margin: "6px 0 0", fontWeight: 500 }}>
                    {p.moneda} {p.precio_noche}
                    <span style={{ color: "#6B6B6B", fontWeight: 400 }}> · {p.huespedes} {locale === "en" ? "guests" : "huésp."}</span>
                  </p>
                  <a
                    href={`/propiedades/${p.slug}`}
                    style={{ display: "inline-block", marginTop: 10, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A8874E", borderBottom: "1px solid rgba(201,169,110,0.5)", paddingBottom: 2, textDecoration: "none" }}
                  >
                    {t.viewProperty ?? (locale === "en" ? "View stay" : "Ver estancia")} →
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
