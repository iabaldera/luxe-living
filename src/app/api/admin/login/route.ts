import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { user, pin } = await req.json().catch(() => ({ user: "", pin: "" }));

  const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
  const ADMIN_PIN = process.env.ADMIN_PIN ?? "admin1234";

  if (String(user).trim().toLowerCase() !== ADMIN_USER.toLowerCase() || String(pin).trim() !== ADMIN_PIN) {
    return NextResponse.json({ error: "Usuario o PIN incorrecto." }, { status: 401 });
  }

  // Credenciales del usuario Supabase que respalda la sesión admin.
  // Si no se definen, derivamos de ADMIN_USER + ADMIN_PIN con un sufijo para cumplir mínimos.
  const adminEmail = (process.env.ADMIN_EMAIL ?? `${ADMIN_USER.toLowerCase()}@luxeliving.app`).trim();
  const adminPassword = process.env.ADMIN_PASSWORD ?? `${ADMIN_PIN}-luxe-admin`;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return NextResponse.json({ error: "Falta NEXT_PUBLIC_SUPABASE_URL." }, { status: 500 });

  const supabase = createClient();
  let { error } = await supabase.auth.signInWithPassword({ email: adminEmail, password: adminPassword });

  if (error) {
    // Intentamos auto-provisionar el usuario admin usando la service role key.
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json({
        error: "No se pudo iniciar sesión. Define SUPABASE_SERVICE_ROLE_KEY en Vercel para que el admin se cree automáticamente, o define ADMIN_EMAIL y ADMIN_PASSWORD con un usuario Supabase existente.",
      }, { status: 500 });
    }
    const adminApi = createAdminClient(url, serviceKey, { auth: { persistSession: false } });
    const { error: createErr } = await adminApi.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { role: "admin" },
    });
    if (createErr && !/registered|exists/i.test(createErr.message)) {
      return NextResponse.json({ error: `Error creando admin: ${createErr.message}` }, { status: 500 });
    }
    const retry = await supabase.auth.signInWithPassword({ email: adminEmail, password: adminPassword });
    if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 401 });
  }

  return NextResponse.json({ ok: true, email: adminEmail });
}
