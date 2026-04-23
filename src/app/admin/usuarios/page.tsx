import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return (
      <div className="max-w-4xl">
        <h1 className="font-serif text-3xl text-luxe-black">Usuarios</h1>
        <div className="mt-6 p-6 border border-luxe-line rounded-sm bg-luxe-bone">
          <p className="text-sm text-luxe-muted">
            Configura <code className="text-luxe-gold-deep">SUPABASE_SERVICE_ROLE_KEY</code> en Vercel para habilitar la gestión de usuarios.
          </p>
        </div>
      </div>
    );
  }

  const admin = createAdminClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">Panel</p>
          <h1 className="mt-1 font-serif text-3xl text-luxe-black">Usuarios</h1>
          <p className="mt-1 text-sm text-luxe-muted">Huéspedes registrados en la plataforma.</p>
        </div>
        {data && <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{data.users.length} usuario(s)</span>}
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error.message}</p>}

      <div className="mt-8 bg-white border border-luxe-line rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-luxe-bone text-[10px] tracking-luxe uppercase text-luxe-muted">
            <tr>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Correo</th>
              <th className="text-left px-4 py-3">Creado</th>
              <th className="text-left px-4 py-3">Último acceso</th>
              <th className="text-left px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {(data?.users ?? []).map((u) => {
              const nombre = (u.user_metadata?.nombre as string) || "—";
              const confirmed = !!u.email_confirmed_at;
              return (
                <tr key={u.id} className="border-t border-luxe-line">
                  <td className="px-4 py-3 text-luxe-black">{nombre}</td>
                  <td className="px-4 py-3 text-luxe-muted">{u.email}</td>
                  <td className="px-4 py-3 text-luxe-muted text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 text-luxe-muted text-xs">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "Nunca"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-luxe uppercase px-2 py-1 rounded-full border ${
                      confirmed ? "border-luxe-gold/50 bg-luxe-gold/10 text-luxe-black" : "border-luxe-line text-luxe-muted"
                    }`}>
                      {confirmed ? "Confirmado" : "Pendiente"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {(!data || data.users.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-luxe-muted text-sm">No hay usuarios todavía.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
