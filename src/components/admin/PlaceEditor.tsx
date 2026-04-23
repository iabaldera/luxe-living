"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { PlaceRow } from "@/lib/supabase/types";
import LocationPicker from "./LocationPicker";
import SinglePhotoUploader from "./SinglePhotoUploader";

const CATS = [
  { v: "turismo", label: "Turismo" },
  { v: "gastronomia", label: "Gastronomía" },
  { v: "entretenimiento", label: "Entretenimiento" },
] as const;

const blank: Partial<PlaceRow> = {
  slug: "", nombre: "", nombre_en: "", categoria: "turismo", subcategoria: "",
  descripcion: "", descripcion_en: "", lat: 19.4517, lng: -70.697,
  foto: null, google_maps_url: "", activo: true, icono: "", icono_color: "",
};

const ICON_PRESETS = ["🍽️", "🍷", "☕", "🏖️", "🏞️", "🎭", "🎨", "🛍️", "🏛️", "⛪", "🎰", "🎳", "⚽", "🏊", "🧘", "💆", "🏨", "🏡", "⭐", "📍"];
const COLOR_PRESETS = ["#C9A96E", "#D9BE89", "#A8874E", "#F8F5F0", "#E85D75", "#5DADE2", "#58D68D", "#F5B041", "#AF7AC5", "#34495E"];

export default function PlaceEditor({ initial }: { initial?: PlaceRow }) {
  const router = useRouter();
  const supabase = createClient();
  const [p, setP] = useState<Partial<PlaceRow>>(initial ?? blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = <K extends keyof PlaceRow>(k: K, v: PlaceRow[K]) => setP((s) => ({ ...s, [k]: v }));

  async function save() {
    setErr(null);
    if (!p.slug || !p.nombre || !p.categoria) { setErr("Slug, nombre y categoría son obligatorios."); return; }
    if (!p.google_maps_url) {
      p.google_maps_url = `https://maps.google.com/?q=${p.lat},${p.lng}`;
    }
    setSaving(true);
    const { data, error } = initial
      ? await supabase.from("places").update(p).eq("id", initial.id).select().single()
      : await supabase.from("places").insert(p).select().single();
    setSaving(false);
    if (error) return setErr(error.message);
    router.push(`/admin/lugares/${data!.id}`);
    router.refresh();
  }

  async function remove() {
    if (!initial || !confirm("¿Eliminar lugar?")) return;
    await supabase.from("places").delete().eq("id", initial.id);
    router.push("/admin/lugares");
    router.refresh();
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl text-luxe-black">{initial ? "Editar lugar" : "Nuevo lugar"}</h1>
        <div className="flex gap-3">
          {initial && (
            <button onClick={remove} className="px-4 py-2 text-xs tracking-luxe uppercase text-red-600 hover:text-red-800">Eliminar</button>
          )}
          <button onClick={save} disabled={saving}
            className="px-5 py-2.5 bg-luxe-black text-luxe-bone text-xs tracking-luxe uppercase hover:bg-luxe-gold hover:text-luxe-black transition-colors disabled:opacity-50">
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>

      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

      <div className="mt-8 grid gap-8">
        <Section title="Identificación">
          <Grid2>
            <Input label="Slug" value={p.slug ?? ""} onChange={(v) => set("slug", v)} />
            <label className="block">
              <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Categoría</span>
              <select value={p.categoria ?? "turismo"} onChange={(e) => set("categoria", e.target.value as any)}
                className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold">
                {CATS.map((c) => <option key={c.v} value={c.v}>{c.label}</option>)}
              </select>
            </label>
          </Grid2>
          <Grid2>
            <Input label="Nombre (ES)" value={p.nombre ?? ""} onChange={(v) => set("nombre", v)} />
            <Input label="Nombre (EN)" value={p.nombre_en ?? ""} onChange={(v) => set("nombre_en", v)} />
          </Grid2>
          <Grid2>
            <Input label="Subcategoría (ej. japones, lujo, parques)" value={p.subcategoria ?? ""} onChange={(v) => set("subcategoria", v)} />
            <Input label="URL Google Maps (opcional)" value={p.google_maps_url ?? ""} onChange={(v) => set("google_maps_url", v)} />
          </Grid2>
          <div className="flex">
            <Toggle label="Visible en el mapa" checked={!!p.activo} onChange={(v) => set("activo", v)} />
          </div>
        </Section>

        <Section title="Descripción">
          <Grid2>
            <Textarea label="Descripción (ES)" value={p.descripcion ?? ""} onChange={(v) => set("descripcion", v)} />
            <Textarea label="Descripción (EN)" value={p.descripcion_en ?? ""} onChange={(v) => set("descripcion_en", v)} />
          </Grid2>
        </Section>

        <Section title="Ubicación">
          <LocationPicker lat={p.lat ?? null} lng={p.lng ?? null} onChange={(la, ln) => { set("lat", la); set("lng", ln); }} />
        </Section>

        <Section title="Foto">
          <SinglePhotoUploader folder="lugares" value={p.foto ?? null} onChange={(url) => set("foto", url)} />
        </Section>

        <Section title="Icono del mapa">
          <p className="text-xs text-luxe-muted">Personaliza el pin: escoge un emoji (o pega una URL de imagen) y un color. Si lo dejas vacío se usa el diseño por defecto.</p>
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2" style={{ background: p.icono_color || "#C9A96E", borderColor: "#0A0A0A" }}>
              {p.icono && /^https?:\/\//i.test(p.icono) ? <img src={p.icono} alt="" className="w-10 h-10 rounded-full object-cover" /> : <span>{p.icono || "📍"}</span>}
            </div>
            <div className="flex-1 space-y-3">
              <Input label="Emoji o URL de imagen" value={p.icono ?? ""} onChange={(v) => set("icono", v)} />
              <IconUpload onUploaded={(url) => set("icono", url)} />
              <div className="flex flex-wrap gap-1.5">
                {ICON_PRESETS.map((e) => (
                  <button key={e} type="button" onClick={() => set("icono", e)}
                    className="w-9 h-9 rounded-sm border border-luxe-line hover:border-luxe-gold bg-luxe-bone text-lg">{e}</button>
                ))}
                <button type="button" onClick={() => set("icono", "")}
                  className="px-2 h-9 rounded-sm border border-luxe-line hover:border-luxe-gold bg-luxe-bone text-[10px] tracking-luxe uppercase text-luxe-muted">Limpiar</button>
              </div>
            </div>
          </div>
          <div>
            <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Color de fondo</span>
            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((c) => (
                <button key={c} type="button" onClick={() => set("icono_color", c)}
                  className={`w-8 h-8 rounded-full border-2 ${p.icono_color === c ? "border-luxe-black" : "border-luxe-line"}`}
                  style={{ background: c }} />
              ))}
              <input type="color" value={p.icono_color || "#C9A96E"} onChange={(e) => set("icono_color", e.target.value)}
                className="w-10 h-8 rounded-sm border border-luxe-line cursor-pointer" />
              <button type="button" onClick={() => set("icono_color", "")}
                className="px-2 h-8 rounded-sm border border-luxe-line hover:border-luxe-gold text-[10px] tracking-luxe uppercase text-luxe-muted">Por defecto</button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="bg-white border border-luxe-line rounded-sm p-6"><h2 className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">{title}</h2><div className="mt-5 space-y-4">{children}</div></div>;
}
function Grid2({ children }: { children: React.ReactNode }) { return <div className="grid gap-4 md:grid-cols-2">{children}</div>; }
function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" /></label>;
}
function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span><textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-luxe-gold" /></label>;
}
function IconUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
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
    onUploaded(data.publicUrl);
  }
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer text-[11px] tracking-luxe uppercase text-luxe-muted hover:text-luxe-gold">
      <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={upload} disabled={busy} />
      <span className="px-3 py-1.5 border border-luxe-line rounded-sm bg-luxe-bone hover:border-luxe-gold">{busy ? "Subiendo…" : "↑ Subir PNG/imagen"}</span>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <span className={`w-10 h-6 rounded-full transition-colors relative ${checked ? "bg-luxe-gold" : "bg-luxe-line"}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm text-luxe-black">{label}</span>
    </label>
  );
}
