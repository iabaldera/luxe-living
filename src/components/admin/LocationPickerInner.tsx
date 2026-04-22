"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TILE_URL, TILE_ATTRIBUTION } from "@/lib/mapStyle";
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

export default function LocationPickerInner({
  lat, lng, onChange,
}: { lat: number | null; lng: number | null; onChange: (lat: number, lng: number) => void }) {
  const [pos, setPos] = useState<[number, number]>([lat ?? DEFAULT[0], lng ?? DEFAULT[1]]);

  useEffect(() => {
    if (lat != null && lng != null) setPos([lat, lng]);
  }, [lat, lng]);

  const update = (la: number, ln: number) => { setPos([la, ln]); onChange(la, ln); };

  return (
    <div className="space-y-2">
      <div className="h-72 rounded-sm overflow-hidden border border-luxe-line">
        <MapContainer center={pos} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} subdomains={["a","b","c","d"]} />
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
      <p className="text-xs text-luxe-muted">Arrastra el pin o haz click en el mapa para ajustar la ubicación.</p>
    </div>
  );
}
