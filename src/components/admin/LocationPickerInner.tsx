"use client";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_STYLES, DEFAULT_STYLE } from "@/lib/mapStyle";
import MapStyleSwitcher from "../MapStyleSwitcher";
import { useEffect, useState } from "react";

const DEFAULT: [number, number] = [19.4517, -70.697];

const icon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="30" height="40">
    <path d="M12 0C6 0 2 4 2 10c0 7 10 22 10 22s10-15 10-22c0-6-4-10-10-10z" fill="#C9A96E" stroke="#0A0A0A" stroke-width="1"/>
    <circle cx="12" cy="10" r="3.2" fill="#0A0A0A"/>
  </svg>`,
  className: "luxe-marker-picker",
  iconSize: [30, 40],
  iconAnchor: [15, 38],
});

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onPick(e.latlng.lat, e.latlng.lng); } });
  return null;
}

function Recenter({ pos }: { pos: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(pos, map.getZoom()); }, [pos, map]);
  return null;
}

function parseGMapsUrl(url: string): [number, number] | null {
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return [parseFloat(atMatch[1]), parseFloat(atMatch[2])];
  const dMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (dMatch) return [parseFloat(dMatch[1]), parseFloat(dMatch[2])];
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return [parseFloat(qMatch[1]), parseFloat(qMatch[2])];
  const plain = url.match(/^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/);
  if (plain) return [parseFloat(plain[1]), parseFloat(plain[2])];
  return null;
}

export default function LocationPickerInner({
  lat, lng, onChange,
}: { lat: number | null; lng: number | null; onChange: (lat: number, lng: number) => void }) {
  const [pos, setPos] = useState<[number, number]>([lat ?? DEFAULT[0], lng ?? DEFAULT[1]]);
  const [styleKey, setStyleKeyState] = useState(DEFAULT_STYLE.key);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("luxe-map-style");
    if (saved && MAP_STYLES.some((s) => s.key === saved)) setStyleKeyState(saved);
    const onCustom = (e: Event) => {
      const k = (e as CustomEvent<string>).detail;
      if (k && MAP_STYLES.some((s) => s.key === k)) setStyleKeyState(k);
    };
    window.addEventListener("luxe-map-style", onCustom as EventListener);
    return () => window.removeEventListener("luxe-map-style", onCustom as EventListener);
  }, []);
  const setStyleKey = (k: string) => {
    setStyleKeyState(k);
    if (typeof window !== "undefined") {
      localStorage.setItem("luxe-map-style", k);
      window.dispatchEvent(new CustomEvent("luxe-map-style", { detail: k }));
    }
  };
  const [search, setSearch] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const style = MAP_STYLES.find((s) => s.key === styleKey) ?? DEFAULT_STYLE;

  useEffect(() => {
    if (lat != null && lng != null) setPos([lat, lng]);
  }, [lat, lng]);

  const update = (la: number, ln: number) => { setPos([la, ln]); onChange(la, ln); };

  async function doSearch() {
    if (!search.trim()) return;
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(search)}`, {
        headers: { "Accept-Language": "es" },
      });
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        update(parseFloat(data[0].lat), parseFloat(data[0].lon));
        setMsg({ type: "ok", text: `Encontrado: ${data[0].display_name}` });
      } else {
        setMsg({ type: "err", text: "Sin resultados." });
      }
    } catch {
      setMsg({ type: "err", text: "Error de búsqueda." });
    } finally { setBusy(false); }
  }

  function doUrl() {
    const parsed = parseGMapsUrl(urlInput);
    if (parsed) {
      update(parsed[0], parsed[1]);
      setMsg({ type: "ok", text: "Coordenadas extraídas del enlace." });
      setUrlInput("");
    } else {
      setMsg({ type: "err", text: "No se pudo leer el enlace. Usa un enlace de Google Maps con @lat,lng." });
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) { setMsg({ type: "err", text: "Geolocalización no disponible." }); return; }
    setBusy(true); setMsg(null);
    navigator.geolocation.getCurrentPosition(
      (p) => { update(p.coords.latitude, p.coords.longitude); setMsg({ type: "ok", text: "Ubicación actual fijada." }); setBusy(false); },
      () => { setMsg({ type: "err", text: "No se pudo obtener tu ubicación." }); setBusy(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-2">
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); doSearch(); } }}
            placeholder="Buscar dirección (ej: Av. 27 Feb, Santiago)"
            className="flex-1 bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-luxe-gold"
          />
          <button type="button" onClick={doSearch} disabled={busy}
            className="px-3 py-2 bg-luxe-ink text-luxe-bone text-[11px] tracking-luxe uppercase rounded-sm hover:bg-luxe-black disabled:opacity-50">
            Buscar
          </button>
        </div>
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); doUrl(); } }}
            placeholder="Pega enlace de Google Maps o lat,lng"
            className="flex-1 bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-luxe-gold"
          />
          <button type="button" onClick={doUrl}
            className="px-3 py-2 bg-luxe-ink text-luxe-bone text-[11px] tracking-luxe uppercase rounded-sm hover:bg-luxe-black">
            Usar
          </button>
        </div>
      </div>
      <button type="button" onClick={useMyLocation} disabled={busy}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] tracking-luxe uppercase border border-luxe-gold/50 text-luxe-gold-deep rounded-sm hover:bg-luxe-gold/10 disabled:opacity-50">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
        Usar mi ubicación
      </button>
      {msg && (
        <p className={`text-xs ${msg.type === "ok" ? "text-luxe-gold-deep" : "text-red-600"}`}>{msg.text}</p>
      )}

      <div className="relative h-72 rounded-sm overflow-hidden border border-luxe-line">
        <div className="absolute top-2 right-2 z-[402]">
          <MapStyleSwitcher value={styleKey} onChange={setStyleKey} />
        </div>
        <MapContainer center={pos} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer key={style.key} url={style.url} attribution={style.attribution} subdomains={style.subdomains ?? []} maxZoom={style.maxZoom} />
          <Recenter pos={pos} />
          <ClickHandler onPick={update} />
          <Marker
            position={pos}
            icon={icon}
            draggable
            eventHandlers={{
              dragend(e) { const { lat, lng } = (e.target as L.Marker).getLatLng(); update(lat, lng); },
            }}
          />
        </MapContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Lat</span>
          <input type="number" step="any" value={pos[0]} onChange={(e) => update(Number(e.target.value), pos[1])}
            className="mt-1 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Lng</span>
          <input type="number" step="any" value={pos[1]} onChange={(e) => update(pos[0], Number(e.target.value))}
            className="mt-1 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2 text-sm" />
        </label>
      </div>
      <p className="text-xs text-luxe-muted">Busca una dirección, pega un enlace de Google Maps, usa tu ubicación actual, o arrastra el pin en el mapa.</p>
    </div>
  );
}
