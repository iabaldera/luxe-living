"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { PropertyRow } from "@/lib/supabase/types";
import LocationPicker from "./LocationPicker";
import PhotoUploader from "./PhotoUploader";
import MapIconPicker from "./MapIconPicker";
import { AMENITY_CATALOG, AMENITY_GROUPS, AMENITY_MAP, amenityIcon, amenityLabel } from "@/lib/amenityCatalog";

const TIPOS = ["apartamento", "penthouse", "estudio", "villa", "casa", "loft", "suite"];

const blank: Partial<PropertyRow> = {
  slug: "", nombre: "", nombre_en: "", ubicacion: "", ubicacion_en: "",
  descripcion: "", descripcion_en: "",
  habitaciones: 1, banos: 1, huespedes: 2, precio_noche: 0, moneda: "USD",
  amenidades: [], lat: null, lng: null, fotos: [], activo: true,
  tipo: "apartamento", piso: "", area_m2: null, camas: null, min_noches: 1,
  check_in_hora: "15:00", check_out_hora: "11:00",
  destacados: [], politica_cancelacion: "", politica_cancelacion_en: "",
  wifi_nombre: "", wifi_clave: "", codigo_acceso: "", video_url: "",
  airbnb_url: "", booking_url: "",
  icono: "", icono_color: "",
};

const ICON_PRESETS_PROP = ["🏡", "🏠", "🏢", "🏨", "🛏️", "🌴", "🏖️", "⭐", "💎", "📍"];
const COLOR_PRESETS_PROP = ["#F8F5F0", "#C9A96E", "#D9BE89", "#A8874E", "#0A0A0A", "#E85D75", "#5DADE2", "#58D68D", "#F5B041", "#AF7AC5"];

export default function PropertyEditor({ initial }: { initial?: PropertyRow }) {
  const router = useRouter();
  const supabase = createClient();
  const [p, setP] = useState<Partial<PropertyRow>>({ ...blank, ...(initial ?? {}) });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [amenityQuery, setAmenityQuery] = useState("");
  const [customAmenity, setCustomAmenity] = useState("");
  const [destacado, setDestacado] = useState("");

  const set = <K extends keyof PropertyRow>(k: K, v: PropertyRow[K]) => setP((s) => ({ ...s, [k]: v }));

  const selected = p.amenidades ?? [];
  const toggleAmenity = (a: string) => {
    set("amenidades", selected.includes(a) ? selected.filter((x) => x !== a) : [...selected, a]);
  };
  const addCustom = () => {
    const v = customAmenity.trim();
    if (!v) return;
    if (!selected.includes(v)) set("amenidades", [...selected, v]);
    setCustomAmenity("");
  };

  const filteredGroups = useMemo(() => {
    const q = amenityQuery.trim().toLowerCase();
    return AMENITY_GROUPS.map((g) => ({
      ...g,
      items: AMENITY_CATALOG.filter(
        (a) => a.group === g.key && (!q || a.es.toLowerCase().includes(q) || a.en.toLowerCase().includes(q) || a.key.includes(q))
      ),
    })).filter((g) => g.items.length > 0);
  }, [amenityQuery]);

  const customSelected = selected.filter((k) => !AMENITY_MAP[k]);

  const destacados = p.destacados ?? [];
  const addDestacado = () => {
    const v = destacado.trim();
    if (!v) return;
    set("destacados", [...destacados, v]);
    setDestacado("");
  };
  const removeDestacado = (i: number) => set("destacados", destacados.filter((_, idx) => idx !== i));

  async function save() {
    setErr(null);
    setSaving(true);
    const autoSlug = (p.slug || p.nombre || "propiedad")
      .toString().toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `propiedad-${Date.now()}`;
    const payload = {
      ...p,
      slug: autoSlug,
      nombre: p.nombre || "Sin nombre",
      nombre_en: p.nombre_en || p.nombre || "Untitled",
      ubicacion: p.ubicacion ?? "",
      ubicacion_en: p.ubicacion_en ?? "",
      descripcion: p.descripcion ?? "",
      descripcion_en: p.descripcion_en ?? "",
      precio_noche: Number(p.precio_noche) || 0,
      area_m2: p.area_m2 ? Number(p.area_m2) : null,
      camas: p.camas ? Number(p.camas) : null,
      min_noches: p.min_noches ? Number(p.min_noches) : null,
      destacada: !!p.destacada,
      orden_destacado: p.orden_destacado != null && p.orden_destacado !== undefined ? Number(p.orden_destacado) : null,
    };
    const { data, error } = initial
      ? await supabase.from("properties").update(payload).eq("id", initial.id).select().single()
      : await supabase.from("properties").insert(payload).select().single();
    setSaving(false);
    if (error) return setErr(error.message);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt((t) => (t && Date.now() - t >= 3000 ? null : t)), 3200);
    if (!initial) {
      router.push(`/admin/propiedades/${data!.id}`);
    }
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

      {savedAt && (
        <div className="fixed bottom-6 right-6 z-[9998] bg-luxe-black text-luxe-bone px-5 py-3 rounded-sm shadow-gold flex items-center gap-3 animate-slide-up">
          <span className="w-6 h-6 rounded-full bg-luxe-gold text-luxe-black flex items-center justify-center text-sm">✓</span>
          <span className="text-xs tracking-luxe uppercase">Propiedad guardada</span>
        </div>
      )}

      <div className="mt-8 grid gap-8">
        <Section title="Identificación">
          <Grid2>
            <Input label="Slug (url)" value={p.slug ?? ""} onChange={(v) => set("slug", v)} />
            <Toggle label="Visible en el sitio" checked={!!p.activo} onChange={(v) => set("activo", v)} />
          </Grid2>
          <Grid2>
            <Toggle label="Destacada en el inicio" checked={!!p.destacada} onChange={(v) => set("destacada", v)} />
            <Input label="Orden destacado (1, 2, 3…)" type="number" value={p.orden_destacado != null ? String(p.orden_destacado) : ""} onChange={(v) => set("orden_destacado", v ? Number(v) : null)} placeholder="Menor = primero" />
          </Grid2>
          <Grid2>
            <Input label="Nombre (ES)" value={p.nombre ?? ""} onChange={(v) => set("nombre", v)} />
            <Input label="Nombre (EN)" value={p.nombre_en ?? ""} onChange={(v) => set("nombre_en", v)} />
          </Grid2>
          <Grid2>
            <Input label="Ubicación (ES)" value={p.ubicacion ?? ""} onChange={(v) => set("ubicacion", v)} />
            <Input label="Ubicación (EN)" value={p.ubicacion_en ?? ""} onChange={(v) => set("ubicacion_en", v)} />
          </Grid2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Select label="Tipo" value={p.tipo ?? ""} onChange={(v) => set("tipo", v)} options={TIPOS} />
            <Input label="Piso / Nivel" value={p.piso ?? ""} onChange={(v) => set("piso", v)} placeholder="Ej: 12" />
            <Input label="Área (m²)" type="number" value={p.area_m2 != null ? String(p.area_m2) : ""} onChange={(v) => set("area_m2", v ? Number(v) : null)} />
          </div>
        </Section>

        <Section title="Descripción">
          <Grid2>
            <Textarea label="Descripción (ES)" value={p.descripcion ?? ""} onChange={(v) => set("descripcion", v)} />
            <Textarea label="Descripción (EN)" value={p.descripcion_en ?? ""} onChange={(v) => set("descripcion_en", v)} />
          </Grid2>
        </Section>

        <Section title="Capacidad y precio">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Input label="Huéspedes" type="number" value={String(p.huespedes ?? 1)} onChange={(v) => set("huespedes", Number(v))} />
            <Input label="Habitaciones" type="number" value={String(p.habitaciones ?? 1)} onChange={(v) => set("habitaciones", Number(v))} />
            <Input label="Camas" type="number" value={p.camas != null ? String(p.camas) : ""} onChange={(v) => set("camas", v ? Number(v) : null)} />
            <Input label="Baños" type="number" value={String(p.banos ?? 1)} onChange={(v) => set("banos", Number(v))} />
            <Input label="Precio / noche" type="number" value={String(p.precio_noche ?? 0)} onChange={(v) => set("precio_noche", Number(v))} />
            <Input label="Moneda" value={p.moneda ?? "USD"} onChange={(v) => set("moneda", v)} />
          </div>
        </Section>

        <Section title="Estancia">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input label="Check-in" value={p.check_in_hora ?? ""} onChange={(v) => set("check_in_hora", v)} placeholder="15:00" />
            <Input label="Check-out" value={p.check_out_hora ?? ""} onChange={(v) => set("check_out_hora", v)} placeholder="11:00" />
            <Input label="Mínimo de noches" type="number" value={p.min_noches != null ? String(p.min_noches) : ""} onChange={(v) => set("min_noches", v ? Number(v) : null)} />
          </div>
          <Grid2>
            <Textarea label="Política de cancelación (ES)" value={p.politica_cancelacion ?? ""} onChange={(v) => set("politica_cancelacion", v)} />
            <Textarea label="Política de cancelación (EN)" value={p.politica_cancelacion_en ?? ""} onChange={(v) => set("politica_cancelacion_en", v)} />
          </Grid2>
        </Section>

        <Section title="Puntos destacados">
          <p className="text-xs text-luxe-muted -mt-3">Frases cortas que resaltan esta estancia (vista al mar, balcón privado, etc.)</p>
          <div className="flex gap-2">
            <input
              value={destacado}
              onChange={(e) => setDestacado(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDestacado(); } }}
              placeholder="Ej: Balcón con vista al monumento"
              className="flex-1 bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold"
            />
            <button onClick={addDestacado} className="px-4 py-2.5 bg-luxe-black text-luxe-bone text-xs tracking-luxe uppercase hover:bg-luxe-gold hover:text-luxe-black transition-colors">
              + Añadir
            </button>
          </div>
          {destacados.length > 0 && (
            <ul className="grid gap-2">
              {destacados.map((d, i) => (
                <li key={i} className="flex items-center justify-between bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2 animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <span className="text-sm text-luxe-black flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxe-gold" />{d}
                  </span>
                  <button onClick={() => removeDestacado(i)} className="text-luxe-muted hover:text-red-600 text-sm">×</button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Amenidades">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-luxe-muted">{selected.length} seleccionadas</p>
            <input
              value={amenityQuery}
              onChange={(e) => setAmenityQuery(e.target.value)}
              placeholder="Buscar amenidad…"
              className="flex-1 min-w-[200px] bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-luxe-gold"
            />
          </div>
          <div className="space-y-5">
            {filteredGroups.map((g) => (
              <div key={g.key}>
                <h3 className="text-[10px] tracking-luxe uppercase text-luxe-gold-deep mb-2">{g.es}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((a) => {
                    const on = selected.includes(a.key);
                    const Icon = a.Icon;
                    return (
                      <button
                        key={a.key}
                        onClick={() => toggleAmenity(a.key)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs tracking-luxe uppercase border rounded-full transition-all duration-200 ease-luxe ${
                          on
                            ? "bg-luxe-black text-luxe-bone border-luxe-black shadow-gold"
                            : "border-luxe-line text-luxe-muted hover:text-luxe-black hover:border-luxe-gold/50"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {a.es}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-luxe-line">
            <h3 className="text-[10px] tracking-luxe uppercase text-luxe-gold-deep mb-2">Amenidad personalizada</h3>
            <div className="flex gap-2">
              <input
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
                placeholder="Ej: Vinoteca climatizada"
                className="flex-1 bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-luxe-gold"
              />
              <button onClick={addCustom} className="px-4 py-2 bg-luxe-black text-luxe-bone text-xs tracking-luxe uppercase hover:bg-luxe-gold hover:text-luxe-black transition-colors">
                + Añadir
              </button>
            </div>
            {customSelected.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {customSelected.map((k) => (
                  <span key={k} className="flex items-center gap-2 px-3 py-1.5 text-xs tracking-luxe uppercase bg-luxe-gold/20 border border-luxe-gold/50 text-luxe-black rounded-full animate-scale-in">
                    {k}
                    <button onClick={() => toggleAmenity(k)} className="hover:text-red-600">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Section>

        <Section title="Enlaces externos de reserva">
          <p className="text-xs text-luxe-muted -mt-3">Aparecen como botones en la ficha pública si tienen URL.</p>
          <Grid2>
            <Input label="Airbnb · URL de la propiedad" value={p.airbnb_url ?? ""} onChange={(v) => set("airbnb_url", v)} placeholder="https://www.airbnb.com/rooms/…" />
            <Input label="Booking.com · URL" value={p.booking_url ?? ""} onChange={(v) => set("booking_url", v)} placeholder="https://www.booking.com/hotel/…" />
          </Grid2>
        </Section>

        <Section title="Acceso e información de llegada">
          <p className="text-xs text-luxe-muted -mt-3">Visible solo para el huésped (no en el listado público).</p>
          <Grid2>
            <Input label="Nombre del WiFi" value={p.wifi_nombre ?? ""} onChange={(v) => set("wifi_nombre", v)} />
            <Input label="Contraseña WiFi" value={p.wifi_clave ?? ""} onChange={(v) => set("wifi_clave", v)} />
          </Grid2>
          <Input label="Código de acceso / puerta" value={p.codigo_acceso ?? ""} onChange={(v) => set("codigo_acceso", v)} />
          <Input label="Video de recorrido (URL)" value={p.video_url ?? ""} onChange={(v) => set("video_url", v)} placeholder="YouTube / Vimeo" />
        </Section>

        <Section title="Ubicación en el mapa">
          <LocationPicker
            lat={p.lat ?? null}
            lng={p.lng ?? null}
            onChange={(la, ln) => { set("lat", la); set("lng", ln); }}
          />
        </Section>

        <Section title="Icono del mapa">
          <p className="text-xs text-luxe-muted">Por defecto el pin muestra la primera foto en miniatura. Personaliza con figura, emoji, PNG o URL.</p>
          <MapIconPicker
            value={p.icono ?? ""}
            color={p.icono_color ?? ""}
            defaultColor="#F8F5F0"
            onChange={(v) => set("icono", v)}
            onColorChange={(c) => set("icono_color", c)}
          />
        </Section>

        <Section title="Fotos">
          <PhotoUploader
            folder="propiedades"
            values={p.fotos ?? []}
            categorias={p.fotos_categorias ?? []}
            onChange={(fotos) => set("fotos", fotos)}
            onCategoriasChange={(cats) => set("fotos_categorias", cats)}
          />
        </Section>

        <div className="sticky bottom-4 bg-luxe-bone/95 backdrop-blur border border-luxe-line rounded-sm p-4 flex items-center justify-between gap-3 shadow-soft">
          <p className="text-xs text-luxe-muted">
            {err ? <span className="text-red-600">{err}</span> : savedAt ? "✓ Guardado" : "Cambios listos para guardar"}
          </p>
          <div className="flex gap-3">
            {initial && (
              <button onClick={remove} className="px-4 py-2 text-xs tracking-luxe uppercase text-red-600 hover:text-red-800">
                Eliminar
              </button>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="px-6 py-3 bg-luxe-black text-luxe-bone text-xs tracking-luxe uppercase hover:bg-luxe-gold hover:text-luxe-black transition-colors disabled:opacity-50 shadow-gold"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-luxe-line rounded-sm p-6 animate-slide-up transition-shadow hover:shadow-soft">
      <h2 className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}
function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold transition-colors" />
    </label>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold">
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4}
        className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-luxe-gold transition-colors" />
    </label>
  );
}
function IconUploadProp({ onUploaded }: { onUploaded: (url: string) => void }) {
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
    <label className="flex items-center gap-3 mt-6 cursor-pointer">
      <span className={`w-10 h-6 rounded-full transition-colors relative ${checked ? "bg-luxe-gold" : "bg-luxe-line"}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ease-luxe ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm text-luxe-black">{label}</span>
    </label>
  );
}
