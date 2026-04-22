import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminLogout from "@/components/admin/AdminLogout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // login route renders without chrome
  if (!user) return <div className="min-h-screen bg-luxe-bone">{children}</div>;

  const links = [
    { href: "/admin", label: "Resumen" },
    { href: "/admin/propiedades", label: "Propiedades" },
    { href: "/admin/lugares", label: "Lugares" },
    { href: "/admin/reglas", label: "Reglas" },
    { href: "/admin/configuracion", label: "Configuración" },
  ];

  return (
    <div className="min-h-screen flex bg-luxe-bone">
      <aside className="w-64 bg-luxe-ink text-luxe-bone flex flex-col p-6">
        <Link href="/admin" className="font-serif text-xl tracking-wide text-luxe-gold">
          Luxe Living
        </Link>
        <p className="text-[10px] tracking-luxe uppercase text-luxe-muted mt-1">Dashboard</p>
        <nav className="mt-10 flex flex-col gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded text-luxe-bone/80 hover:text-luxe-gold hover:bg-luxe-black/40 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto text-xs text-luxe-muted">
          <p className="truncate">{user.email}</p>
          <AdminLogout />
          <Link href="/" className="block mt-2 text-luxe-gold/80 hover:text-luxe-gold">
            ← Ver sitio público
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
