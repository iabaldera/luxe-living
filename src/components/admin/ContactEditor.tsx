"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { ContactSettings } from "@/lib/supabase/types";
import SinglePhotoUploader from "./SinglePhotoUploader";

export default function ContactEditor({ initial }: { initial: ContactSettings }) {
  const supabase = createClient();
  const router = useRouter();
  const [c, setC] = useState<ContactSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true); setMsg(null);
    const { error } = await supabase.from("settings").upsert({ key: "contact", value: c });
    setSaving(false);
    setMsg(error ? error.message : "Guardado ✓");
    router.refresh();
  }

  const set = <K extends keyof ContactSettings>(k: K, v: ContactSettings[K]) =>
    setC((s) => ({ ...s, [k]: v }));

  return (
    <div className="space-y-6">
      <Section title="Marca y branding">
        <Field label="Nombre de marca" value={c.brand} onChange={(v) => set("brand", v)} />
        <div className="grid sm:grid-cols-2 gap-6 pt-2">
          <div>
            <span className="text-[11px] tracking-luxe uppercase text-luxe-muted block mb-1.5">Logo (se muestra en el menú)</span>
            <SinglePhotoUploader folder="branding" value={c.logo ?? null} onChange={(v) => set("logo", v)} />
            <p className="text-[11px] text-luxe-muted mt-2">PNG/SVG transparente recomendado. Si no hay logo se usa el nombre de la marca.</p>
          </div>
          <div>
            <span className="text-[11px] tracking-luxe uppercase text-luxe-muted block mb-1.5">Favicon (pestaña del navegador)</span>
            <SinglePhotoUploader folder="branding" value={c.favicon ?? null} onChange={(v) => set("favicon", v)} />
            <p className="text-[11px] text-luxe-muted mt-2">PNG cuadrado 512×512. Si no se define se usa el logo.</p>
          </div>
        </div>
      </Section>

      <Section title="Canales de contacto">
        <Field label="WhatsApp (formato internacional sin +, ej. 18095550100)" value={c.whatsapp} onChange={(v) => set("whatsapp", v)} />
        <Field label="Telegram (username sin @)" value={c.telegram} onChange={(v) => set("telegram", v)} />
        <Field label="Correo" value={c.email} onChange={(v) => set("email", v)} />
      </Section>

      <Section title="Asistente de reservas (se muestra en Estancias)">
        <div className="grid sm:grid-cols-[auto,1fr] gap-6 items-start">
          <div>
            <span className="text-[11px] tracking-luxe uppercase text-luxe-muted block mb-1.5">Foto</span>
            <SinglePhotoUploader folder="branding" value={c.assistantPhoto ?? null} onChange={(v) => set("assistantPhoto", v)} />
          </div>
          <div className="space-y-4">
            <Field label="Nombre" value={c.assistantName ?? ""} onChange={(v) => set("assistantName", v)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Rol (ES)" value={c.assistantRole ?? ""} onChange={(v) => set("assistantRole", v)} />
              <Field label="Rol (EN)" value={c.assistantRole_en ?? ""} onChange={(v) => set("assistantRole_en", v)} />
            </div>
            <Textarea label="Saludo inicial (ES)" value={c.assistantGreeting ?? ""} onChange={(v) => set("assistantGreeting", v)} />
            <Textarea label="Saludo inicial (EN)" value={c.assistantGreeting_en ?? ""} onChange={(v) => set("assistantGreeting_en", v)} />
          </div>
        </div>
      </Section>

      <div className="flex items-center justify-between pt-4 border-t border-luxe-line">
        {msg && <span className="text-sm text-luxe-gold-deep">{msg}</span>}
        <button onClick={save} disabled={saving}
          className="ml-auto px-5 py-2.5 bg-luxe-black text-luxe-bone text-xs tracking-luxe uppercase hover:bg-luxe-gold hover:text-luxe-black transition-colors disabled:opacity-50">
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-luxe-line rounded-sm p-6">
      <h3 className="font-serif text-lg text-luxe-black mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" /></label>;
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span><textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold resize-y" /></label>;
}
