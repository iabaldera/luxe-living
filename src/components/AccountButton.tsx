"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function AccountButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!alive) return;
      setEmail(user?.email ?? null);
      setName((user?.user_metadata?.nombre as string) ?? null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
      setName((session?.user?.user_metadata?.nombre as string) ?? null);
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setOpen(false);
    router.refresh();
  }

  const initial = (name || email || "?").charAt(0).toUpperCase();
  const size = compact ? "w-8 h-8 text-[11px]" : "w-9 h-9 text-xs";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Cuenta"
        className={`${size} rounded-full border border-luxe-line hover:border-luxe-gold text-luxe-muted hover:text-luxe-gold-deep transition-colors flex items-center justify-center tracking-luxe uppercase`}
      >
        {email ? (
          <span className="font-serif text-luxe-gold-deep">{initial}</span>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
        )}
      </button>
      {open && (
        <div className="absolute right-0 lg:right-auto lg:left-0 top-full mt-2 z-50 min-w-[200px] bg-white border border-luxe-line rounded-sm shadow-soft overflow-hidden">
          {email ? (
            <>
              <div className="px-4 py-3 border-b border-luxe-line">
                <p className="text-[10px] tracking-luxe uppercase text-luxe-muted">Sesión</p>
                <p className="text-sm text-luxe-black truncate">{name || email}</p>
              </div>
              <Link href="/cuenta" onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-xs tracking-luxe uppercase text-luxe-black hover:bg-luxe-cream">
                Mis guardadas
              </Link>
              <button onClick={logout}
                className="w-full text-left px-4 py-2.5 text-xs tracking-luxe uppercase text-luxe-muted hover:bg-luxe-cream hover:text-luxe-black border-t border-luxe-line">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/cuenta/login" onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-xs tracking-luxe uppercase text-luxe-black hover:bg-luxe-cream">
                Iniciar sesión
              </Link>
              <Link href="/cuenta/registro" onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-xs tracking-luxe uppercase text-luxe-muted hover:bg-luxe-cream hover:text-luxe-black border-t border-luxe-line">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
