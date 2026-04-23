"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const EMOJIS = [
  "📍", "⭐", "💎", "👑", "🏆",
  "🏡", "🏠", "🏢", "🏨", "🛏️",
  "🍽️", "🍷", "🍸", "🍹", "☕", "🍰", "🍔", "🍣",
  "🏖️", "🌴", "🏞️", "⛰️", "🌊", "🏝️",
  "🎭", "🎨", "🎼", "🎤", "🎰", "🎳", "🎱",
  "🛍️", "🏛️", "⛪", "🏰",
  "⚽", "🏊", "🧘", "💆", "🚴", "⛵",
  "📸", "💼", "🎁", "🎉", "🌹",
];

// Colored SVG shapes as data URIs — no emoji dependency
const SHAPE_DEFS: Array<{ key: string; label: string; svg: (color: string) => string }> = [
  { key: "diamond", label: "Diamante", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M6 3h12l4 6-10 12L2 9z'/></svg>` },
  { key: "crown", label: "Corona", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M3 7l4 4 5-6 5 6 4-4v12H3z'/></svg>` },
  { key: "star", label: "Estrella", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M12 2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9z'/></svg>` },
  { key: "heart", label: "Corazón", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M12 21s-8-5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-8 11-8 11z'/></svg>` },
  { key: "leaf", label: "Hoja", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M20 4c-8 0-14 4-14 12 0 2 1 4 2 4 8 0 12-6 12-16zM6 20c2-6 6-9 12-10'/></svg>` },
  { key: "house", label: "Casa", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M3 11l9-7 9 7v10H3z'/></svg>` },
  { key: "key", label: "Llave", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><circle cx='8' cy='12' r='4'/><path d='M12 12h10v3h-3v3h-3v-3h-4z'/></svg>` },
  { key: "martini", label: "Copa", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M3 4h18l-8 10v6h4v2H7v-2h4v-6z'/></svg>` },
  { key: "fork", label: "Cubiertos", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M7 2v8a3 3 0 0 0 6 0V2H11v7H9V2zm10 0c-2 2-3 5-3 8s1 4 3 4v8h2V2z'/></svg>` },
  { key: "palm", label: "Palmera", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M12 4c-3 0-6 2-7 5 2-1 4-1 6 0-1 2-1 5 0 7 1-3 3-5 5-6 0 3 2 6 5 7-1-3-1-6 0-8-2 0-3 1-4 2 1-4 4-6 7-6-3-2-7-2-10 0-1-1-1-1-2-1z'/></svg>` },
  { key: "mountain", label: "Montaña", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M2 20l7-14 4 8 3-4 6 10z'/></svg>` },
  { key: "wave", label: "Ola", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M2 12c3-4 5-4 8 0s5 4 8 0 4-4 4 0v8H2z'/></svg>` },
  { key: "ticket", label: "Ticket", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4z'/></svg>` },
  { key: "music", label: "Música", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M9 17V5l11-2v12a3 3 0 1 1-2-3V7L11 8v9a3 3 0 1 1-2-3z'/></svg>` },
  { key: "camera", label: "Cámara", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M4 8h4l2-3h4l2 3h4v12H4z'/><circle cx='12' cy='14' r='4' fill='#fff'/></svg>` },
  { key: "bag", label: "Compras", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M6 8h12l-1 12H7zM9 8a3 3 0 0 1 6 0'/></svg>` },
  { key: "spa", label: "Spa", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><circle cx='12' cy='8' r='4'/><path d='M4 20c2-4 4-6 8-6s6 2 8 6z'/></svg>` },
  { key: "pool", label: "Piscina", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><path d='M2 18c3-2 5-2 8 0s5 2 8 0 4-2 4-2v6H2zM6 4h4v10H6zm8 0h4v10h-4z'/></svg>` },
  { key: "flower", label: "Flor", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><circle cx='12' cy='12' r='3'/><circle cx='12' cy='6' r='3'/><circle cx='12' cy='18' r='3'/><circle cx='6' cy='12' r='3'/><circle cx='18' cy='12' r='3'/></svg>` },
  { key: "sun", label: "Sol", svg: (c) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${c}'><circle cx='12' cy='12' r='5'/><path stroke='${c}' stroke-width='2' d='M12 2v3M12 19v3M2 12h3M19 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2'/></svg>` },
];

const COLORS = ["#C9A96E", "#D9BE89", "#A8874E", "#F8F5F0", "#0A0A0A", "#E85D75", "#5DADE2", "#58D68D", "#F5B041", "#AF7AC5", "#34495E", "#EC7063"];

function shapeDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function MapIconPicker({
  value, color, onChange, onColorChange, defaultColor = "#C9A96E",
}: {
  value: string;
  color: string;
  onChange: (v: string) => void;
  onColorChange: (c: string) => void;
  defaultColor?: string;
}) {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"shapes" | "emoji">("shapes");
  const shapeColor = color || defaultColor === "#F8F5F0" ? "#0A0A0A" : (defaultColor === "#0A0A0A" ? "#C9A96E" : "#0A0A0A");
  const contrast = (color || defaultColor).toLowerCase() === "#f8f5f0" || (color || defaultColor).toLowerCase() === "#ffffff" ? "#0A0A0A" : "#C9A96E";

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    const ext = f.name.split(".").pop() || "png";
    const path = `iconos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("luxe-media").upload(path, f, { cacheControl: "3600" });
    setBusy(false);
    e.target.value = "";
    if (error) return alert(error.message);
    const { data } = supabase.storage.from("luxe-media").getPublicUrl(path);
    onChange(data.publicUrl);
  }

  const isImg = /^(https?:|data:)/.test(value);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-2" style={{ background: color || defaultColor, borderColor: "#C9A96E" }}>
          {value ? (
            isImg ? <img src={value} alt="" className="w-10 h-10 object-contain" /> : <span className="text-2xl">{value}</span>
          ) : <span className="text-2xl">📍</span>}
        </div>
        <div className="flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Emoji, URL o elige abajo"
            className="w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-luxe-gold"
          />
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <label className="inline-flex cursor-pointer text-[10px] tracking-luxe uppercase text-luxe-muted hover:text-luxe-gold">
              <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={upload} disabled={busy} />
              <span className="px-3 py-1.5 border border-luxe-line rounded-sm bg-luxe-bone hover:border-luxe-gold">{busy ? "Subiendo…" : "↑ Subir imagen"}</span>
            </label>
            <button type="button" onClick={() => onChange("")} className="px-2 py-1.5 border border-luxe-line rounded-sm text-[10px] tracking-luxe uppercase text-luxe-muted hover:border-luxe-gold">Limpiar</button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border border-luxe-line rounded-sm p-1 bg-luxe-bone w-fit">
        <button type="button" onClick={() => setTab("shapes")}
          className={`px-3 py-1 text-[10px] tracking-luxe uppercase rounded-sm ${tab === "shapes" ? "bg-luxe-black text-luxe-bone" : "text-luxe-muted"}`}>Figuras</button>
        <button type="button" onClick={() => setTab("emoji")}
          className={`px-3 py-1 text-[10px] tracking-luxe uppercase rounded-sm ${tab === "emoji" ? "bg-luxe-black text-luxe-bone" : "text-luxe-muted"}`}>Emojis</button>
      </div>

      {tab === "shapes" ? (
        <div className="grid grid-cols-7 md:grid-cols-10 gap-1.5">
          {SHAPE_DEFS.map((s) => {
            const uri = shapeDataUri(s.svg(contrast));
            return (
              <button key={s.key} type="button" title={s.label} onClick={() => onChange(uri)}
                className="w-10 h-10 rounded-sm border border-luxe-line hover:border-luxe-gold bg-luxe-bone flex items-center justify-center">
                <img src={uri} alt={s.label} className="w-6 h-6" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-8 md:grid-cols-12 gap-1">
          {EMOJIS.map((e) => (
            <button key={e} type="button" onClick={() => onChange(e)}
              className="w-9 h-9 rounded-sm border border-luxe-line hover:border-luxe-gold bg-luxe-bone text-lg">{e}</button>
          ))}
        </div>
      )}

      <div>
        <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Color de fondo</span>
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button key={c} type="button" onClick={() => onColorChange(c)}
              className={`w-8 h-8 rounded-full border-2 ${color === c ? "border-luxe-black" : "border-luxe-line"}`}
              style={{ background: c }} />
          ))}
          <input type="color" value={color || defaultColor} onChange={(e) => onColorChange(e.target.value)}
            className="w-10 h-8 rounded-sm border border-luxe-line cursor-pointer" />
          <button type="button" onClick={() => onColorChange("")}
            className="px-2 h-8 rounded-sm border border-luxe-line hover:border-luxe-gold text-[10px] tracking-luxe uppercase text-luxe-muted">Por defecto</button>
        </div>
      </div>
    </div>
  );
}
