"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { PropertyRow } from "@/lib/supabase/types";
import LocationPicker from "./LocationPicker";
import PhotoUploader from "./PhotoUploader";

const AMENITIES = ["wifi", "piscina", "gym", "parking", "ac", "cocina", "bbq"];

const blank: Partial<PropertyRow> = {
  slug: "", nombre: "", nombre_en: "", ubicacion: "", ubicacion_en: "",
  descripcion: "", descripcion_en: "",
  habitaciones: 1, banos: 1, huespedes: 2, precio_noche: 0, moneda: "USD",
  amenidades: [], lat: null, lng: null, fotos: [], activo: true,
};

export default function PropertyEditor({ initial }: { initial?: PropertyRow }) {
  const router = useRouter();
  const supabase = createClient();
  const [p, setP] = useState<Partial<PropertyRow>>(initial ?? blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = <K extends keyof PropertyRow>(k: K, v: PropertyRow[K]) => setP((s) => ({ ...s, [k]: v }));
  const toggleAmenity = (a: string) => {
    const cur = p.amenidades ?? [];
    set("amenidades", cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]);
  };

  async function save() {
    setErr(null);
    if (!p.slug || !p.nombre) { setErr("Slug y nombre son obligatorios."); return; }
    setSaving(true);
    const payload = { ...p, precio_noche: Number(p.precio_noche) || 0 };
    const { data, error } = initial
      ? await supabase.from("properties").update(payload).eq("id", initial.id).select().single()
      : await supabase.from("properties").insert(payload).select().single();
    setSaving(false);
    if (error) return setErr(error.message);
    router.push(`/admin/propiedades/${data!.id}`);
    router.refresh();
  }

  async function remove() {
    if (!initial || !confirm("¿Eliminar propiedad?")) return;
    await supabase.from("properties").delete().eq("id", initial.id);
    router.push("/admin/propiedades");
    router.refresh();
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl text-luxe-black">
          {initial ? "Editar propiedad" : "Nueva propiedad"}
        </h1>
        <div className="flex gap-3">
          {initial && (
            <button onClick={remove} className="px-4 py-2 text-xs tracking-luxe uppercase text-red-600 hover:text-red-800">
              Eliminar
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2.5 bg-luxe-black text-luxe-bone text-xs tracking-luxe uppercase hover:bg-luxe-gold hover:text-luxe-black transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>

      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

      <div className="mt-8 grid gap-8">
        <Section title="Identificación">
          <Grid2>
            <Input label="Slug (url)" value={p.slug ?? ""} onChange={(v) => set("slug", v)} />
            <Toggle label="Visible en el sitio" checked={!!p.activo} onChange={(v) => set("activo", v)} />
          </Grid2>
          <Grid2>
            <Input label="Nombre (ES)" value={p.nombre ?? ""} onChange={(v) => set("nombre", v)} />
            <Input label="Nombre (EN)" value={p.nombre_en ?? ""} onChange={(v) => set("nombre_en", v)} />
          </Grid2>
          <Grid2>
            <Input label="Ubicación (ES)" value={p.ubicacion ?? ""} onChange={(v) => set("ubicacion", v)} />
            <Input label="Ubicación (EN)" value={p.ubicacion_en ?? ""} onChange={(v) => set("ubicacion_en", v)} />
          </Grid2>
        </Section>

        <Section title="Descripción">
          <Grid2>
            <Textarea label="Descripción (ES)" value={p.descripcion ?? ""} onChange={(v) => set("descripcion", v)} />
            <Textarea label="Descripción (EN)" value={p.descripcion_en ?? ""} onChange={(v) => set("descripcion_en", v)} />
          </Grid2>
        </Section>

        <Section title="Capacidad y precio">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Input label="Huéspedes" type="number" value={String(p.huespedes ?? 1)} onChange={(v) => set("huespedes", Number(v))} />
            <Input label="Habitaciones" type="number" value={String(p.habitaciones ?? 1)} onChange={(v) => set("habitaciones", Number(v))} />
            <Input label="Baños" type="number" value={String(p.banos ?? 1)} onChange={(v) => set("banos", Number(v))} />
            <Input label="Precio / noche" type="number" value={String(p.precio_noche ?? 0)} onChange={(v) => set("precio_noche", Number(v))} />
            <Input label="Moneda" value={p.moneda ?? "USD"} onChange={(v) => set("moneda", v)} />
          </div>
        </Section>

        <Section title="Amenidades">
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => {
              const on = (p.amenidades ?? []).includes(a);
              return (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 text-xs tracking-luxe uppercase border rounded-full transition-colors ${
                    on ? "bg-luxe-black text-luxe-bone border-luxe-black" : "border-luxe-line text-luxe-muted hover:text-luxe-black"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Ubicación en el mapa">
          <LocationPicker
            lat={p.lat ?? null}
            lng={p.lng ?? null}
            onChange={(la, ln) => { set("lat", la); set("lng", ln); }}
          />
        </Section>

        <Section title="Fotos">
          <PhotoUploader
            folder="propiedades"
            values={p.fotos ?? []}
            onChange={(fotos) => set("fotos", fotos)}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-luxe-line rounded-sm p-6">
      <h2 className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}
function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" />
    </label>
  );
}
function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4}
        className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-luxe-gold" />
    </label>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 mt-6 cursor-pointer">
      <span className={`w-10 h-6 rounded-full transition-colors relative ${checked ? "bg-luxe-gold" : "bg-luxe-line"}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm text-luxe-black">{label}</span>
    </label>
  );
}
