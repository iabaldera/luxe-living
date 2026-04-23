"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type Role = "admin" | "cohost" | "supervisor" | "huesped";

const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrador",
  cohost: "Co-host",
  supervisor: "Supervisor",
  huesped: "Huésped",
};

type MenuLink = { href: string; label: string };

const ROLE_LINKS: Record<Role, MenuLink[]> = {
  admin: [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/usuarios", label: "Usuarios" },
    { href: "/admin/propiedades", label: "Propiedades" },
    { href: "/cuenta", label: "Mis guardadas" },
  ],
  cohost: [
    { href: "/admin/propiedades", label: "Mis propiedades" },
    { href: "/admin/reservas", label: "Reservas" },
    { href: "/cuenta", label: "Mis guardadas" },
  ],
  supervisor: [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/reservas", label: "Reservas" },
    { href: "/cuenta", label: "Mis guardadas" },
  ],
  huesped: [
    { href: "/cuenta", label: "Mis guardadas" },
    { href: "/cuenta/reservas", label: "Mis reservas" },
  ],
};

function normalizeRole(raw: unknown): Role {
  const r = String(raw ?? "").toLowerCase();
  if (r === "admin") return "admin";
  if (r === "cohost" || r === "co-host" || r === "co_host") return "cohost";
  if (r === "supervisor") return "supervisor";
  return "huesped";
}

export default function AccountButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("huesped");
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<"left" | "right">("right");
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!alive) return;
      setEmail(user?.email ?? null);
      setName((user?.user_metadata?.nombre as string) ?? null);
      setRole(normalizeRole(user?.user_metadata?.role));
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
      setName((session?.user?.user_metadata?.nombre as string) ?? null);
      setRole(normalizeRole(session?.user?.user_metadata?.role));
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const menuW = 240;
    setAlign(rect.left + menuW > window.innerWidth ? "right" : "left");
  }, [open]);

  async function logout() {
    await supabase.auth.signOut();
    setOpen(false);
    router.refresh();
  }

  const initial = (name || email || "?").charAt(0).toUpperCase();
  const size = compact ? "w-8 h-8 text-[11px]" : "w-9 h-9 text-xs";
  const links = email ? ROLE_LINKS[role] : [];

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
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
        <div
          className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full mt-2 z-50 w-[240px] max-h-[80vh] overflow-y-auto bg-white border border-luxe-line rounded-sm shadow-soft`}
        >
          {email ? (
            <>
              <div className="px-4 py-3 border-b border-luxe-line">
                <p className="text-[10px] tracking-luxe uppercase text-luxe-gold-deep">{ROLE_LABEL[role]}</p>
                <p className="mt-0.5 text-sm text-luxe-black truncate">{name || email}</p>
                {name && <p className="text-[11px] text-luxe-muted truncate">{email}</p>}
              </div>
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-xs tracking-luxe uppercase text-luxe-black hover:bg-luxe-cream border-b border-luxe-line/60">
                  {l.label}
                </Link>
              ))}
              <button onClick={logout}
                className="w-full text-left px-4 py-2.5 text-xs tracking-luxe uppercase text-luxe-muted hover:bg-luxe-cream hover:text-luxe-black">
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
