import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { PropertyRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function PropertiesList() {
  const supabase = createClient();
  const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
  const rows = (data ?? []) as PropertyRow[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-luxe-black">Propiedades</h1>
          <p className="text-luxe-muted mt-1 text-sm">{rows.length} registradas</p>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="px-5 py-2.5 bg-luxe-black text-luxe-bone text-xs tracking-luxe uppercase hover:bg-luxe-gold hover:text-luxe-black transition-colors"
        >
          + Nueva propiedad
        </Link>
      </div>

      <div className="mt-8 bg-white border border-luxe-line rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-luxe-cream text-[11px] tracking-luxe uppercase text-luxe-muted">
            <tr>
              <th className="text-left px-5 py-3">Propiedad</th>
              <th className="text-left px-5 py-3">Ubicación</th>
              <th className="text-left px-5 py-3">Precio</th>
              <th className="text-left px-5 py-3">Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-luxe-line hover:bg-luxe-cream/40">
                <td className="px-5 py-3">
                  <div className="font-serif text-base text-luxe-black">{p.nombre}</div>
                  <div className="text-xs text-luxe-muted">{p.slug}</div>
                </td>
                <td className="px-5 py-3 text-luxe-muted">{p.ubicacion}</td>
                <td className="px-5 py-3 font-serif">${p.precio_noche} {p.moneda}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] tracking-luxe uppercase px-2 py-1 rounded ${p.activo ? "bg-luxe-gold/20 text-luxe-gold-deep" : "bg-luxe-line text-luxe-muted"}`}>
                    {p.activo ? "Activa" : "Oculta"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/propiedades/${p.id}`} className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep hover:text-luxe-black">
                    Editar →
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-luxe-muted">Sin propiedades aún.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
