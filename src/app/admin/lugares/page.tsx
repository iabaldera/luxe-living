import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { PlaceRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const CAT_LABEL: Record<string, string> = {
  turismo: "Turismo", gastronomia: "Gastronomía", entretenimiento: "Entretenimiento",
};

export default async function PlacesList() {
  const supabase = createClient();
  const { data } = await supabase.from("places").select("*").order("categoria").order("nombre");
  const rows = (data ?? []) as PlaceRow[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-luxe-black">Lugares del mapa</h1>
          <p className="text-luxe-muted mt-1 text-sm">{rows.length} puntos de interés</p>
        </div>
        <Link href="/admin/lugares/nuevo" className="px-5 py-2.5 bg-luxe-black text-luxe-bone text-xs tracking-luxe uppercase hover:bg-luxe-gold hover:text-luxe-black transition-colors">
          + Nuevo lugar
        </Link>
      </div>

      <div className="mt-8 bg-white border border-luxe-line rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-luxe-cream text-[11px] tracking-luxe uppercase text-luxe-muted">
            <tr>
              <th className="text-left px-5 py-3">Lugar</th>
              <th className="text-left px-5 py-3">Categoría</th>
              <th className="text-left px-5 py-3">Subcategoría</th>
              <th className="text-left px-5 py-3">Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-luxe-line hover:bg-luxe-cream/40">
                <td className="px-5 py-3 font-serif">{p.nombre}</td>
                <td className="px-5 py-3 text-luxe-muted">{CAT_LABEL[p.categoria]}</td>
                <td className="px-5 py-3 text-luxe-muted">{p.subcategoria || "—"}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] tracking-luxe uppercase px-2 py-1 rounded ${p.activo ? "bg-luxe-gold/20 text-luxe-gold-deep" : "bg-luxe-line text-luxe-muted"}`}>
                    {p.activo ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/lugares/${p.id}`} className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep hover:text-luxe-black">
                    Editar →
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-luxe-muted">Sin lugares aún.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
