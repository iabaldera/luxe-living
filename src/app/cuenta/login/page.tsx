"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function CuentaLoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/cuenta";
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    setLoading(false);
    if (error) return setErr(error.message);
    router.push(next);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxe-bone px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-10 rounded-sm border border-luxe-line">
        <p className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">Luxe Living</p>
        <h1 className="mt-2 font-serif text-3xl text-luxe-black">Iniciar sesión</h1>
        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Correo</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" />
          </label>
          <label className="block">
            <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Contraseña</span>
            <input type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)}
              className="mt-1.5 w-full bg-luxe-bone border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" />
          </label>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 text-xs tracking-luxe uppercase bg-luxe-black text-luxe-bone hover:bg-luxe-gold hover:text-luxe-black transition-colors disabled:opacity-50">
            {loading ? "Accediendo…" : "Entrar"}
          </button>
          <p className="text-xs text-luxe-muted text-center pt-2">
            ¿Sin cuenta?{" "}
            <Link href={`/cuenta/registro?next=${encodeURIComponent(next)}`} className="text-luxe-gold-deep hover:text-luxe-black border-b border-luxe-gold/50">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
