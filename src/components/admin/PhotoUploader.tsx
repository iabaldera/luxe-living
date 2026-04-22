"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const BUCKET = "luxe-media";

export default function PhotoUploader({
  folder, values, onChange,
}: { folder: string; values: string[]; onChange: (fotos: string[]) => void }) {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true); setErr(null);
    const urls: string[] = [];
    for (const f of files) {
      const ext = f.name.split(".").pop() || "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, f, { cacheControl: "3600" });
      if (error) { setErr(error.message); continue; }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    setBusy(false);
    e.target.value = "";
    if (urls.length) onChange([...values, ...urls]);
  }

  function remove(i: number) { onChange(values.filter((_, idx) => idx !== i)); }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = values.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {values.map((url, i) => (
          <div key={url} className="relative group">
            <div className="aspect-square bg-cover bg-center rounded-sm border border-luxe-line" style={{ backgroundImage: `url('${url}')` }} />
            {i === 0 && <span className="absolute top-1 left-1 bg-luxe-gold text-luxe-black text-[9px] tracking-luxe uppercase px-1.5 py-0.5 rounded">Portada</span>}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-sm">
              <button onClick={() => move(i, -1)} className="text-white text-xs px-2 py-1 border border-white/50 hover:border-luxe-gold">←</button>
              <button onClick={() => move(i, 1)} className="text-white text-xs px-2 py-1 border border-white/50 hover:border-luxe-gold">→</button>
              <button onClick={() => remove(i)} className="text-white text-xs px-2 py-1 border border-white/50 hover:border-red-400">×</button>
            </div>
          </div>
        ))}
        <label className="aspect-square border-2 border-dashed border-luxe-line rounded-sm flex items-center justify-center text-xs tracking-luxe uppercase text-luxe-muted hover:text-luxe-gold hover:border-luxe-gold cursor-pointer">
          <input type="file" accept="image/*" multiple onChange={upload} className="hidden" disabled={busy} />
          {busy ? "Subiendo…" : "+ Subir"}
        </label>
      </div>
      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
      <p className="mt-3 text-xs text-luxe-muted">La primera foto se usa como portada. Arrastra con ← → para reordenar.</p>
    </div>
  );
}
