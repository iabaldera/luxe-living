"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_STYLES, DEFAULT_STYLE, categoryColor } from "@/lib/mapStyle";
import MapStyleSwitcher from "./MapStyleSwitcher";
import type { PlaceRow as Place, PropertyRow } from "@/lib/supabase/types";
import { useEffect, useState } from "react";

const CENTER: [number, number] = [19.4517, -70.697];

function makeIcon(color: string, isProperty = false, custom?: { icono?: string | null; color?: string | null }) {
  const fill = custom?.color || color;
  const raw = (custom?.icono || "").trim();
  const isImg = /^https?:\/\//i.test(raw) || /^\/.+\.(png|jpg|jpeg|svg|webp|gif)(\?.*)?$/i.test(raw);
  const size = isProperty ? 42 : 36;
  const stroke = isProperty ? "#C9A96E" : "#0A0A0A";

  let html: string;
  if (raw) {
    const inner = isImg
      ? `<img src="${escapeAttr(raw)}" alt="" style="width:70%;height:70%;object-fit:contain;pointer-events:none;" />`
      : `<span style="font-size:${Math.round(size * 0.55)}px;line-height:1;">${escapeHtml(raw)}</span>`;
    html = `<div class="luxe-pin" style="width:${size}px;height:${size}px;background:${fill};border:2px solid ${stroke};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.35);position:relative;">
      ${inner}
      <span style="position:absolute;bottom:-7px;left:50%;transform:translateX(-50%) rotate(45deg);width:10px;height:10px;background:${fill};border-right:2px solid ${stroke};border-bottom:2px solid ${stroke};"></span>
    </div>`;
  } else {
    const svg = isProperty
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="34" height="42">
          <path d="M16 0C8 0 2 6 2 14c0 10 14 26 14 26s14-16 14-26c0-8-6-14-14-14z" fill="${fill}" stroke="#C9A96E" stroke-width="2"/>
          <path d="M10 16l6-5 6 5v7a1 1 0 0 1-1 1h-3v-4h-4v4h-3a1 1 0 0 1-1-1z" fill="#0A0A0A"/>
        </svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="28" height="36">
          <path d="M12 0C6 0 2 4 2 10c0 7 10 22 10 22s10-15 10-22c0-6-4-10-10-10z" fill="${fill}" stroke="#0A0A0A" stroke-width="1"/>
          <circle cx="12" cy="10" r="3.2" fill="#0A0A0A"/>
        </svg>`;
    html = svg;
  }

  const w = raw ? size : (isProperty ? 34 : 28);
  const h = raw ? size + 8 : (isProperty ? 42 : 36);
  return L.divIcon({
    html,
    className: "luxe-marker",
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h + 6],
  });
}

function escapeAttr(s: string) { return s.replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
function escapeHtml(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

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
  const [styleKey, setStyleKeyState] = useState(DEFAULT_STYLE.key);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("luxe-map-style");
    if (saved && MAP_STYLES.some((s) => s.key === saved)) setStyleKeyState(saved);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "luxe-map-style" && e.newValue && MAP_STYLES.some((s) => s.key === e.newValue)) {
        setStyleKeyState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    const onCustom = (e: Event) => {
      const k = (e as CustomEvent<string>).detail;
      if (k && MAP_STYLES.some((s) => s.key === k)) setStyleKeyState(k);
    };
    window.addEventListener("luxe-map-style", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("luxe-map-style", onCustom as EventListener);
    };
  }, []);
  const setStyleKey = (k: string) => {
    setStyleKeyState(k);
    if (typeof window !== "undefined") {
      localStorage.setItem("luxe-map-style", k);
      window.dispatchEvent(new CustomEvent("luxe-map-style", { detail: k }));
    }
  };
  const style = MAP_STYLES.find((s) => s.key === styleKey) ?? DEFAULT_STYLE;
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
    <div className="relative h-full w-full">
      <div className="absolute top-3 right-3 z-[402]">
        <MapStyleSwitcher value={styleKey} onChange={setStyleKey} />
      </div>
    <MapContainer center={CENTER} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl={false}>
      <TileLayer key={style.key} url={style.url} attribution={style.attribution} subdomains={style.subdomains ?? []} maxZoom={style.maxZoom} />

      {places.map((p) => (
        <Marker
          key={`place-${p.id}`}
          position={[p.lat, p.lng]}
          icon={makeIcon(categoryColor[p.categoria], false, { icono: p.icono, color: p.icono_color })}
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
            icon={makeIcon(categoryColor.estancias, true, { icono: p.icono, color: p.icono_color })}
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
    </div>
  );
}
