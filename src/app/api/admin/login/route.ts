import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { user, pin } = await req.json().catch(() => ({ user: "", pin: "" }));

  const ADMIN_USER = process.env.ADMIN_USER ?? "nailea";
  const ADMIN_PIN = process.env.ADMIN_PIN ?? "2812";
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Configuración de admin incompleta. Define ADMIN_EMAIL y ADMIN_PASSWORD en Vercel." }, { status: 500 });
  }

  if (String(user).trim().toLowerCase() !== ADMIN_USER.toLowerCase() || String(pin).trim() !== ADMIN_PIN) {
    return NextResponse.json({ error: "Usuario o PIN incorrecto." }, { status: 401 });
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });

  return NextResponse.json({ ok: true });
}
