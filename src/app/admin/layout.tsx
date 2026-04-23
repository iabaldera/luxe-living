import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div className="min-h-screen bg-luxe-bone">{children}</div>;

  const links = [
    { href: "/admin", label: "Resumen" },
    { href: "/admin/propiedades", label: "Propiedades" },
    { href: "/admin/lugares", label: "Lugares" },
    { href: "/admin/reglas", label: "Reglas" },
    { href: "/admin/usuarios", label: "Usuarios" },
    { href: "/admin/configuracion", label: "Configuración" },
  ];

  return (
    <div className="min-h-screen lg:flex bg-luxe-bone">
      <AdminNav email={user.email ?? ""} links={links} />
      <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
