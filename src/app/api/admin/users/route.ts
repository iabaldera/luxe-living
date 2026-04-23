import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = (user?.user_metadata as any)?.role;
  if (!user || role !== "admin") return null;
  return user;
}

function adminApi() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createAdminClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { email, password, nombre, telefono, avatar_url, role } = body;
  if (!email || !password) return NextResponse.json({ error: "Correo y contraseña son requeridos" }, { status: 400 });

  const { data, error } = await adminApi().auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { nombre, telefono, avatar_url, role: role ?? "user" },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.user.id });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { id, email, password, nombre, telefono, avatar_url, role } = body;
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });

  const updates: any = {};
  if (email) updates.email = email;
  if (password) updates.password = password;
  const meta: any = {};
  if (nombre !== undefined) meta.nombre = nombre;
  if (telefono !== undefined) meta.telefono = telefono;
  if (avatar_url !== undefined) meta.avatar_url = avatar_url;
  if (role !== undefined) meta.role = role;
  if (Object.keys(meta).length) updates.user_metadata = meta;

  const api = adminApi();
  // Merge con metadata existente
  if (updates.user_metadata) {
    const { data: existing } = await api.auth.admin.getUserById(id);
    updates.user_metadata = { ...(existing?.user?.user_metadata || {}), ...updates.user_metadata };
  }

  const { error } = await api.auth.admin.updateUserById(id, updates);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });
  const { error } = await adminApi().auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
