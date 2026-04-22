"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const BUCKET = "luxe-media";

export default function SinglePhotoUploader({
  folder, value, onChange,
}: { folder: string; value: string | null; onChange: (url: string | null) => void }) {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setErr(null);
    const ext = f.name.split(".").pop() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, f, { cacheControl: "3600" });
    setBusy(false);
    e.target.value = "";
    if (error) return setErr(error.message);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
  }

  return (
    <div className="flex items-center gap-4">
      {value ? (
        <div className="relative">
          <div className="w-32 h-32 bg-cover bg-center rounded-sm border border-luxe-line" style={{ backgroundImage: `url('${value}')` }} />
          <button onClick={() => onChange(null)} className="absolute -top-2 -right-2 bg-white border border-luxe-line w-7 h-7 rounded-full text-xs hover:border-red-400">×</button>
        </div>
      ) : (
        <label className="w-32 h-32 border-2 border-dashed border-luxe-line rounded-sm flex items-center justify-center text-xs tracking-luxe uppercase text-luxe-muted hover:text-luxe-gold hover:border-luxe-gold cursor-pointer">
          <input type="file" accept="image/*" onChange={upload} className="hidden" disabled={busy} />
          {busy ? "Subiendo…" : "+ Foto"}
        </label>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}
    </div>
  );
}
