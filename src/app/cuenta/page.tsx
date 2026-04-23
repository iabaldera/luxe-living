import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/PropertyCard";
import type { PropertyRow } from "@/lib/supabase/types";
import AccountLogout from "@/components/AccountLogout";

export const dynamic = "force-dynamic";

export default async function CuentaPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/login?next=/cuenta");

  const { data: saved } = await supabase
    .from("saved_properties")
    .select("property_id, created_at, properties:property_id (*)")
    .order("created_at", { ascending: false });

  const properties: PropertyRow[] = (saved ?? [])
    .map((r: any) => r.properties)
    .filter(Boolean);

  const nombre = (user.user_metadata?.nombre as string) || user.email;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 lg:py-16">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">Mi cuenta</p>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl text-luxe-black">Hola, {nombre}</h1>
          <p className="mt-1 text-sm text-luxe-muted">{user.email}</p>
        </div>
        <AccountLogout />
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-2xl text-luxe-black">Propiedades guardadas</h2>
        {properties.length === 0 ? (
          <div className="mt-6 p-8 border border-luxe-line rounded-sm bg-white text-center">
            <p className="text-sm text-luxe-muted">Aún no has guardado propiedades.</p>
            <Link href="/propiedades" className="mt-4 inline-block text-[11px] tracking-luxe uppercase text-luxe-gold-deep border-b border-luxe-gold/50 hover:text-luxe-black">
              Explorar estancias →
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
