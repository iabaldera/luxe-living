import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Admins predefinidos. Cada uno se auto-provisiona como usuario Supabase con role=admin.
// Los 3 primeros entran con "Usuario / PIN"; el último con "Correo / Clave".
type Admin = { user?: string; pin?: string; email: string; password: string };
const ADMINS: Admin[] = [
  { user: "nailea", pin: "2812", email: "nailea@luxeliving.do", password: "nailea-2812-admin" },
  { user: "mariela", pin: "2812", email: "mariela@luxeliving.do", password: "mariela-2812-admin" },
  { user: "esther", pin: "2812", email: "esther@luxeliving.do", password: "esther-2812-admin" },
  { user: "admin", pin: "admin1234", email: "admin@luxeliving.do", password: "admin-admin1234" },
  { email: "nailea@luxeliving.do", password: "nailea2026" },
];

async function ensureSupabaseUser(url: string, serviceKey: string, email: string, password: string) {
  const adminApi = createAdminClient(url, serviceKey, { auth: { persistSession: false } });
  const { error } = await adminApi.auth.admin.createUser({
    email, password, email_confirm: true, user_metadata: { role: "admin" },
  });
  if (error && !/registered|exists|already/i.test(error.message)) {
    throw new Error(error.message);
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const user = String(body.user ?? "").trim().toLowerCase();
  const pin = String(body.pin ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  let target: Admin | undefined;
  if (user && pin) {
    target = ADMINS.find((a) => a.user?.toLowerCase() === user && a.pin === pin);
  } else if (email && password) {
    target = ADMINS.find((a) => a.email.toLowerCase() === email && a.password === password);
  }
  if (!target) {
    return NextResponse.json({ error: "Credenciales incorrectas." }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return NextResponse.json({ error: "Falta NEXT_PUBLIC_SUPABASE_URL." }, { status: 500 });

  const supabase = createClient();
  let signIn = await supabase.auth.signInWithPassword({ email: target.email, password: target.password });

  if (signIn.error) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json({
        error: "Define SUPABASE_SERVICE_ROLE_KEY en Vercel para crear los usuarios admin automáticamente.",
      }, { status: 500 });
    }
    try { await ensureSupabaseUser(url, serviceKey, target.email, target.password); }
    catch (e: any) { return NextResponse.json({ error: `Creando admin: ${e.message}` }, { status: 500 }); }
    signIn = await supabase.auth.signInWithPassword({ email: target.email, password: target.password });
    if (signIn.error) return NextResponse.json({ error: signIn.error.message }, { status: 401 });
  }

  return NextResponse.json({ ok: true, email: target.email });
}
