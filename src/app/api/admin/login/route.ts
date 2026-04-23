import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { user, pin } = await req.json().catch(() => ({ user: "", pin: "" }));

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Configuración de admin incompleta. Define ADMIN_EMAIL y ADMIN_PASSWORD en Vercel." }, { status: 500 });
  }

  // Pares usuario/PIN aceptados. Se pueden ampliar con ADMIN_USERS="user1:pin1,user2:pin2" en Vercel.
  const defaults: [string, string][] = [
    ["admin", "admin1234"],
    ["nailea", "2812"],
  ];
  const extra = (process.env.ADMIN_USERS ?? "")
    .split(",").map((p) => p.trim()).filter(Boolean)
    .map((pair) => pair.split(":").map((s) => s.trim()) as [string, string])
    .filter((p) => p.length === 2 && p[0] && p[1]);
  // Compat con vars sueltas
  if (process.env.ADMIN_USER && process.env.ADMIN_PIN) {
    extra.push([process.env.ADMIN_USER, process.env.ADMIN_PIN]);
  }
  const pairs = [...defaults, ...extra];

  const u = String(user).trim().toLowerCase();
  const p = String(pin).trim();
  const match = pairs.some(([uu, pp]) => uu.toLowerCase() === u && pp === p);
  if (!match) {
    return NextResponse.json({ error: "Usuario o PIN incorrecto." }, { status: 401 });
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });

  return NextResponse.json({ ok: true });
}
