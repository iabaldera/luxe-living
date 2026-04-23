"use client";
import { useState } from "react";
import { MAP_STYLES } from "@/lib/mapStyle";

export default function MapStyleSwitcher({
  value, onChange, className = "",
}: { value: string; onChange: (key: string) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const current = MAP_STYLES.find((s) => s.key === value) ?? MAP_STYLES[0];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-luxe-ink/90 backdrop-blur text-luxe-bone border border-luxe-gold/40 rounded-sm px-3 py-2 text-[11px] tracking-luxe uppercase shadow-lg hover:border-luxe-gold transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3zM9 4v13M15 7v13" />
        </svg>
        <span>Estilo de mapa: {current.label}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[400]" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full mb-1 right-0 z-[401] bg-luxe-ink border border-luxe-gold/40 rounded-sm shadow-xl min-w-[160px] overflow-hidden">
            {MAP_STYLES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => { onChange(s.key); setOpen(false); }}
                className={`block w-full text-left px-3 py-2 text-[11px] tracking-luxe uppercase transition-colors ${
                  s.key === value ? "bg-luxe-gold text-luxe-black" : "text-luxe-bone hover:bg-luxe-black/50 hover:text-luxe-gold"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
