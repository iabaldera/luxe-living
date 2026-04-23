"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const BUCKET = "luxe-media";
const MAX_PHOTOS = 30;
const ZONES = ["Sala", "Cocina", "Comedor", "Habitación", "Habitación principal", "Baño", "Terraza", "Balcón", "Piscina", "Exterior", "Vista", "Área de trabajo", "Lavandería"];

export default function PhotoUploader({
  folder, values, categorias = [], onChange, onCategoriasChange, max = MAX_PHOTOS,
}: {
  folder: string;
  values: string[];
  categorias?: string[];
  onChange: (fotos: string[]) => void;
  onCategoriasChange?: (cats: string[]) => void;
  max?: number;
}) {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const remaining = Math.max(0, max - values.length);
  const atLimit = remaining === 0;

  const normCats = () => {
    const out = values.map((_, i) => categorias[i] ?? "");
    return out;
  };

  const updateCat = (i: number, v: string) => {
    if (!onCategoriasChange) return;
    const next = normCats();
    next[i] = v;
    onCategoriasChange(next);
  };

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
    if (urls.length) {
      onChange([...values, ...urls]);
      onCategoriasChange?.([...normCats(), ...urls.map(() => "")]);
    }
  }

  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i));
    onCategoriasChange?.(normCats().filter((_, idx) => idx !== i));
  }
  function makeCover(i: number) {
    if (i === 0) return;
    const next = values.slice();
    const [item] = next.splice(i, 1);
    next.unshift(item);
    onChange(next);
    if (onCategoriasChange) {
      const c = normCats();
      const [cv] = c.splice(i, 1);
      c.unshift(cv);
      onCategoriasChange(c);
    }
  }
  function reorder(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= values.length || to >= values.length) return;
    const next = values.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    if (onCategoriasChange) {
      const c = normCats();
      const [cv] = c.splice(from, 1);
      c.splice(to, 0, cv);
      onCategoriasChange(c);
    }
  }

  const catList = normCats();

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {values.map((url, i) => {
          const isOver = overIdx === i && dragIdx !== null && dragIdx !== i;
          return (
            <div
              key={url + i}
              className={`group relative rounded-sm transition-all duration-200 ease-luxe ${
                dragIdx === i ? "opacity-40 scale-95" : ""
              } ${isOver ? "ring-2 ring-luxe-gold ring-offset-2 ring-offset-luxe-bone" : ""}`}
            >
              <div
                draggable
                onDragStart={(e) => { setDragIdx(i); e.dataTransfer.effectAllowed = "move"; }}
                onDragOver={(e) => { e.preventDefault(); if (overIdx !== i) setOverIdx(i); }}
                onDragLeave={() => { if (overIdx === i) setOverIdx(null); }}
                onDrop={(e) => { e.preventDefault(); if (dragIdx != null) reorder(dragIdx, i); setDragIdx(null); setOverIdx(null); }}
                onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
                className={`aspect-square bg-cover bg-center rounded-sm border cursor-grab active:cursor-grabbing transition-all duration-200 ${
                  i === 0 ? "border-luxe-gold shadow-gold" : "border-luxe-line"
                }`}
                style={{ backgroundImage: `url('${url}')` }}
              />
              <span className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-luxe-black/70 backdrop-blur text-luxe-bone text-[9px] tracking-luxe uppercase px-1.5 py-0.5 rounded pointer-events-none">
                <span className="font-serif text-luxe-gold">#{i + 1}</span>
              </span>
              {i === 0 && (
                <span className="absolute top-1.5 right-1.5 bg-luxe-gold text-luxe-black text-[9px] tracking-luxe uppercase px-1.5 py-0.5 rounded animate-scale-in pointer-events-none">
                  ★ Portada
                </span>
              )}
              <div className="absolute inset-x-0 bottom-[28px] p-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black/75 to-transparent">
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
              {onCategoriasChange && (() => {
                const cur = catList[i] ?? "";
                const isCustom = cur && !ZONES.includes(cur);
                return (
                  <div className="mt-1.5 space-y-1">
                    <select
                      value={isCustom ? "__custom__" : cur}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "__custom__") updateCat(i, cur || " ");
                        else updateCat(i, v);
                      }}
                      className={`w-full rounded-sm px-2 py-1.5 text-xs focus:outline-none focus:border-luxe-gold border ${
                        cur ? "bg-luxe-gold/20 border-luxe-gold/60 text-luxe-black font-medium" : "bg-luxe-bone border-luxe-line text-luxe-muted"
                      }`}
                    >
                      <option value="">— Sin zona —</option>
                      {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                      <option value="__custom__">Otra…</option>
                    </select>
                    {isCustom && (
                      <input
                        value={cur}
                        onChange={(e) => updateCat(i, e.target.value)}
                        placeholder="Zona personalizada"
                        className="w-full bg-luxe-bone border border-luxe-line rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-luxe-gold"
                      />
                    )}
                  </div>
                );
              })()}
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
        {values.length}/{max} fotos · Asigna una <span className="text-luxe-gold-deep">zona</span> a cada foto (Sala, Cocina, Habitación…) para el recorrido estilo Airbnb. Arrastra para reordenar.
      </p>
      {onCategoriasChange && catList.some(Boolean) && (
        <div className="mt-4 p-4 bg-luxe-bone/60 border border-luxe-line rounded-sm">
          <p className="text-[10px] tracking-luxe uppercase text-luxe-gold-deep mb-2">Resumen por zona</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(
              catList.reduce((acc, c) => {
                const k = c || "Sin zona";
                acc[k] = (acc[k] ?? 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([z, n]) => (
              <span key={z} className={`text-[10px] tracking-luxe uppercase px-2 py-1 rounded-full border ${
                z === "Sin zona" ? "border-luxe-line text-luxe-muted" : "border-luxe-gold/50 text-luxe-black bg-luxe-gold/10"
              }`}>
                {z} · {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
