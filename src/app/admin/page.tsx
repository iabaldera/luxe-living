import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHome() {
  const supabase = createClient();
  const [{ count: propCount }, { count: placeCount }, { count: rulesCount }] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("places").select("*", { count: "exact", head: true }),
    supabase.from("rules").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    { href: "/admin/propiedades", label: "Propiedades", count: propCount ?? 0 },
    { href: "/admin/lugares", label: "Lugares del mapa", count: placeCount ?? 0 },
    { href: "/admin/reglas", label: "Reglas", count: rulesCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl text-luxe-black">Resumen</h1>
      <p className="text-luxe-muted mt-1 text-sm">Gestión de contenido del portal de huéspedes.</p>
      <div className="grid gap-6 md:grid-cols-3 mt-10">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="block bg-white border border-luxe-line rounded-sm p-6 hover:border-luxe-gold/50 hover:shadow-gold transition"
          >
            <p className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">{c.label}</p>
            <p className="mt-3 font-serif text-4xl text-luxe-black">{c.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
