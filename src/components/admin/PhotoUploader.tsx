"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const BUCKET = "luxe-media";
const MAX_PHOTOS = 10;

export default function PhotoUploader({
  folder, values, onChange, max = MAX_PHOTOS,
}: { folder: string; values: string[]; onChange: (fotos: string[]) => void; max?: number }) {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const remaining = Math.max(0, max - values.length);
  const atLimit = remaining === 0;

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = "";
    if (atLimit) { setErr(`Máximo ${max} fotos.`); return; }
    const toUpload = files.slice(0, remaining);
    const skipped = files.length - toUpload.length;
    setBusy(true); setErr(skipped > 0 ? `Se omitieron ${skipped} foto(s): límite de ${max}.` : null);
    const urls: string[] = [];
    for (const f of toUpload) {
      const ext = f.name.split(".").pop() || "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, f, { cacheControl: "3600" });
      if (error) { setErr(error.message); continue; }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    setBusy(false);
    if (urls.length) onChange([...values, ...urls]);
  }

  function remove(i: number) { onChange(values.filter((_, idx) => idx !== i)); }
  function makeCover(i: number) {
    if (i === 0) return;
    const next = values.slice();
    const [item] = next.splice(i, 1);
    next.unshift(item);
    onChange(next);
  }
  function reorder(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= values.length || to >= values.length) return;
    const next = values.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {values.map((url, i) => {
          const isOver = overIdx === i && dragIdx !== null && dragIdx !== i;
          return (
            <div
              key={url}
              draggable
              onDragStart={(e) => { setDragIdx(i); e.dataTransfer.effectAllowed = "move"; }}
              onDragOver={(e) => { e.preventDefault(); if (overIdx !== i) setOverIdx(i); }}
              onDragLeave={() => { if (overIdx === i) setOverIdx(null); }}
              onDrop={(e) => { e.preventDefault(); if (dragIdx != null) reorder(dragIdx, i); setDragIdx(null); setOverIdx(null); }}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
              className={`group relative rounded-sm transition-all duration-200 ease-luxe ${
                dragIdx === i ? "opacity-40 scale-95" : ""
              } ${isOver ? "ring-2 ring-luxe-gold ring-offset-2 ring-offset-luxe-bone" : ""}`}
            >
              <div
                className={`aspect-square bg-cover bg-center rounded-sm border cursor-grab active:cursor-grabbing transition-all duration-200 ${
                  i === 0 ? "border-luxe-gold shadow-gold" : "border-luxe-line"
                }`}
                style={{ backgroundImage: `url('${url}')` }}
              />
              <span className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-luxe-black/70 backdrop-blur text-luxe-bone text-[9px] tracking-luxe uppercase px-1.5 py-0.5 rounded">
                <span className="font-serif text-luxe-gold">#{i + 1}</span>
              </span>
              {i === 0 && (
                <span className="absolute top-1.5 right-1.5 bg-luxe-gold text-luxe-black text-[9px] tracking-luxe uppercase px-1.5 py-0.5 rounded animate-scale-in">
                  ★ Portada
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/75 to-transparent rounded-b-sm">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(i)}
                    className="flex-1 text-[9px] tracking-luxe uppercase bg-luxe-gold/90 text-luxe-black py-1 rounded hover:bg-luxe-gold transition-colors"
                    title="Hacer portada"
                  >
                    ★ Portada
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="px-2 text-[11px] bg-red-500/90 text-white py-1 rounded hover:bg-red-600 transition-colors"
                  title="Eliminar"
                >
                  ×
                </button>
              </div>
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-70 transition-opacity pointer-events-none text-luxe-bone text-xs bg-luxe-black/60 px-2 py-1 rounded">
                ⋮⋮ arrastra
              </span>
            </div>
          );
        })}
        {!atLimit && (
          <label className="aspect-square border-2 border-dashed border-luxe-line rounded-sm flex flex-col items-center justify-center gap-1 text-xs tracking-luxe uppercase text-luxe-muted hover:text-luxe-gold hover:border-luxe-gold cursor-pointer transition-colors">
            <input type="file" accept="image/*" multiple onChange={upload} className="hidden" disabled={busy} />
            <span className="text-2xl font-serif">+</span>
            <span>{busy ? "Subiendo…" : "Subir"}</span>
          </label>
        )}
      </div>
      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
      <p className="mt-3 text-xs text-luxe-muted">
        {values.length}/{max} fotos · La primera es la portada. Arrastra para reordenar o usa <span className="text-luxe-gold-deep">★ Portada</span>.
      </p>
    </div>
  );
}
