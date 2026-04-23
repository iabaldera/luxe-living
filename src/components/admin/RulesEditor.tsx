"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { RuleRow } from "@/lib/supabase/types";
import { RULE_ICONS, RULE_ICON_KEYS } from "@/lib/ruleIcons";

const ICONOS = RULE_ICON_KEYS;

export default function RulesEditor({ initial }: { initial: RuleRow[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [rows, setRows] = useState<Partial<RuleRow>[]>(initial);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function update(i: number, patch: Partial<RuleRow>) {
    setRows((s) => s.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function save(i: number) {
    const r = rows[i];
    setErr(null); setSavingId(r.id ?? "new-" + i);
    const clave = r.clave || `regla-${Date.now()}-${i}`;
    const payload = {
      ...r,
      clave,
      titulo: r.titulo ?? "",
      titulo_en: r.titulo_en ?? "",
      descripcion: r.descripcion ?? "",
      descripcion_en: r.descripcion_en ?? "",
      orden: i,
    };
    const { data, error } = r.id
      ? await supabase.from("rules").update(payload).eq("id", r.id).select().single()
      : await supabase.from("rules").insert(payload).select().single();
    setSavingId(null);
    if (error) return setErr(error.message);
    if (!r.id) update(i, data as RuleRow);
    router.refresh();
  }

  async function remove(i: number) {
    const r = rows[i];
    if (r.id && !confirm("¿Eliminar regla?")) return;
    if (r.id) await supabase.from("rules").delete().eq("id", r.id);
    setRows((s) => s.filter((_, idx) => idx !== i));
    router.refresh();
  }

  function add() {
    setRows((s) => [...s, { clave: "", icono: "silencio", titulo: "", titulo_en: "", descripcion: "", descripcion_en: "", orden: s.length, activo: true }]);
  }

  return (
    <div className="space-y-4">
      {err && <p className="text-sm text-red-600">{err}</p>}
      {rows.map((r, i) => {
        const IconPreview = RULE_ICONS[r.icono ?? "silencio"] ?? RULE_ICONS.info;
        return (
        <div key={r.id ?? `new-${i}`} className="bg-white border border-luxe-line rounded-sm p-5 animate-slide-up transition-shadow hover:shadow-soft" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="grid gap-3 md:grid-cols-4 items-end">
            <Field label="Clave" value={r.clave ?? ""} onChange={(v) => update(i, { clave: v })} />
            <label className="block">
              <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Ícono</span>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-luxe-gold/60 rounded-full text-luxe-gold-deep">
                  <IconPreview className="w-5 h-5" />
                </span>
                <select value={r.icono ?? "silencio"} onChange={(e) => update(i, { icono: e.target.value })}
                  className="flex-1 bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold">
                  {ICONOS.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            </label>
            <Field label="Título (ES)" value={r.titulo ?? ""} onChange={(v) => update(i, { titulo: v })} />
            <Field label="Título (EN)" value={r.titulo_en ?? ""} onChange={(v) => update(i, { titulo_en: v })} />
          </div>
          <div className="grid gap-3 md:grid-cols-2 mt-3">
            <TextArea label="Descripción (ES)" value={r.descripcion ?? ""} onChange={(v) => update(i, { descripcion: v })} />
            <TextArea label="Descripción (EN)" value={r.descripcion_en ?? ""} onChange={(v) => update(i, { descripcion_en: v })} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!r.activo} onChange={(e) => update(i, { activo: e.target.checked })} />
              Activa
            </label>
            <div className="flex gap-3">
              <button onClick={() => remove(i)} className="text-xs tracking-luxe uppercase text-red-600 hover:text-red-800">Eliminar</button>
              <button onClick={() => save(i)} disabled={savingId === (r.id ?? "new-" + i)}
                className="px-4 py-2 bg-luxe-black text-luxe-bone text-xs tracking-luxe uppercase hover:bg-luxe-gold hover:text-luxe-black transition-colors disabled:opacity-50">
                {savingId === (r.id ?? "new-" + i) ? "…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
        );
      })}
      <button onClick={add} className="w-full py-4 border-2 border-dashed border-luxe-line rounded-sm text-xs tracking-luxe uppercase text-luxe-muted hover:text-luxe-gold hover:border-luxe-gold">
        + Agregar regla
      </button>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" /></label>;
}
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span><textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-luxe-gold" /></label>;
}
