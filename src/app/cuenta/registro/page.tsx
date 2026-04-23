"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function CuentaRegistroPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/cuenta";
  const supabase = createClient();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setInfo(null); setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email, password: pwd,
      options: { data: { nombre } },
    });
    setLoading(false);
    if (error) return setErr(error.message);
    if (!data.session) {
      setInfo("Cuenta creada. Revisa tu correo para confirmar antes de entrar.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxe-bone px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-10 rounded-sm border border-luxe-line">
        <p className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">Luxe Living</p>
        <h1 className="mt-2 font-serif text-3xl text-luxe-black">Crear cuenta</h1>
        <p className="mt-1 text-xs text-luxe-muted">Guarda propiedades y accede a tu lista desde cualquier dispositivo.</p>
        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Nombre</span>
            <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" />
          </label>
          <label className="block">
            <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Correo</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" />
          </label>
          <label className="block">
            <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Contraseña (mín. 6)</span>
            <input type="password" required minLength={6} value={pwd} onChange={(e) => setPwd(e.target.value)}
              className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" />
          </label>
          {err && <p className="text-sm text-red-600">{err}</p>}
          {info && <p className="text-sm text-luxe-gold-deep">{info}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 text-xs tracking-luxe uppercase bg-luxe-black text-luxe-bone hover:bg-luxe-gold hover:text-luxe-black transition-colors disabled:opacity-50">
            {loading ? "Creando…" : "Crear cuenta"}
          </button>
          <p className="text-xs text-luxe-muted text-center pt-2">
            ¿Ya tienes cuenta?{" "}
            <Link href={`/cuenta/login?next=${encodeURIComponent(next)}`} className="text-luxe-gold-deep hover:text-luxe-black border-b border-luxe-gold/50">
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
