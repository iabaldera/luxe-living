import { createClient as createAdminClient } from "@supabase/supabase-js";
import UsersClient, { type AdminUser } from "./UsersClient";

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
            Configura <code className="text-luxe-gold-deep">SUPABASE_SERVICE_ROLE_KEY</code> en Vercel para gestionar usuarios.
          </p>
        </div>
      </div>
    );
  }

  const admin = createAdminClient(url, serviceKey, { auth: { persistSession: false } });
  const all: any[] = [];
  let page = 1;
  let error: any = null;
  while (true) {
    const { data, error: e } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (e) { error = e; break; }
    const batch = data?.users ?? [];
    all.push(...batch);
    if (batch.length < 1000) break;
    page += 1;
    if (page > 20) break;
  }

  const users: AdminUser[] = all.map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    email_confirmed_at: u.email_confirmed_at ?? null,
    user_metadata: u.user_metadata as any,
  }));

  return (
    <div className="max-w-5xl">
      {error && <p className="mb-4 text-sm text-red-600">{error.message}</p>}
      <UsersClient users={users} />
    </div>
  );
}
