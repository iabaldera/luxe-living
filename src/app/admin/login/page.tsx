"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"pin" | "email">("pin");
  const [user, setUser] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      const payload = mode === "pin" ? { user, pin } : { email, password: pwd };
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(data.error ?? "No se pudo iniciar sesión."); return; }
      router.push("/admin");
      router.refresh();
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxe-black px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-luxe-bone p-10 rounded-sm shadow-soft">
        <p className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">Luxe Living</p>
        <h1 className="mt-2 font-serif text-3xl text-luxe-black">Dashboard</h1>

        <div className="mt-6 flex gap-1 text-[11px] tracking-luxe uppercase border border-luxe-line rounded-sm p-1 bg-white">
          <button type="button" onClick={() => setMode("pin")}
            className={`flex-1 py-2 rounded-sm transition-colors ${mode === "pin" ? "bg-luxe-black text-luxe-bone" : "text-luxe-muted hover:text-luxe-black"}`}>
            Usuario / PIN
          </button>
          <button type="button" onClick={() => setMode("email")}
            className={`flex-1 py-2 rounded-sm transition-colors ${mode === "email" ? "bg-luxe-black text-luxe-bone" : "text-luxe-muted hover:text-luxe-black"}`}>
            Correo / Clave
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {mode === "pin" ? (
            <>
              <label className="block">
                <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Usuario</span>
                <input type="text" autoComplete="username" required value={user} onChange={(e) => setUser(e.target.value)}
                  className="mt-1.5 w-full bg-white border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" />
              </label>
              <label className="block">
                <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">PIN</span>
                <input type="password" autoComplete="current-password" required value={pin} onChange={(e) => setPin(e.target.value)}
                  className="mt-1.5 w-full bg-white border border-luxe-line rounded-sm px-3 py-2.5 text-sm tracking-[0.3em] focus:outline-none focus:border-luxe-gold" />
              </label>
            </>
          ) : (
            <>
              <label className="block">
                <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Correo</span>
                <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full bg-white border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" />
              </label>
              <label className="block">
                <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Contraseña</span>
                <input type="password" autoComplete="current-password" required value={pwd} onChange={(e) => setPwd(e.target.value)}
                  className="mt-1.5 w-full bg-white border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" />
              </label>
            </>
          )}
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 text-xs tracking-luxe uppercase bg-luxe-black text-luxe-bone hover:bg-luxe-gold hover:text-luxe-black transition-colors disabled:opacity-50">
            {loading ? "Accediendo…" : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
