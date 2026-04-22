"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { ContactSettings } from "@/lib/supabase/types";

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

  const set = (k: keyof ContactSettings, v: string) => setC((s) => ({ ...s, [k]: v }));

  return (
    <div className="bg-white border border-luxe-line rounded-sm p-6 space-y-4">
      <Field label="Nombre de marca" value={c.brand} onChange={(v) => set("brand", v)} />
      <Field label="WhatsApp (formato internacional sin +, ej. 18095550100)" value={c.whatsapp} onChange={(v) => set("whatsapp", v)} />
      <Field label="Telegram (username sin @)" value={c.telegram} onChange={(v) => set("telegram", v)} />
      <Field label="Correo" value={c.email} onChange={(v) => set("email", v)} />
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

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" /></label>;
}
