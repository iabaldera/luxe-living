"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLogout from "./AdminLogout";

interface Props {
  email: string;
  links: { href: string; label: string }[];
}

export default function AdminNav({ email, links }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const current = links.find((l) => pathname === l.href) ?? links.find((l) => pathname.startsWith(l.href + "/"));

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 bg-luxe-ink text-luxe-bone border-b border-luxe-black/50 flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-luxe-black/40 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div className="flex flex-col items-center">
          <span className="font-serif text-luxe-gold text-sm leading-tight">Luxe Living</span>
          {current && <span className="text-[10px] tracking-luxe uppercase text-luxe-muted">{current.label}</span>}
        </div>
        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded hover:bg-luxe-black/40 transition-colors" aria-label="Ver sitio">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 12l9-9 9 9M5 10v10h14V10" />
          </svg>
        </Link>
      </header>

      {open && (
        <div className="lg:hidden fixed inset-0 z-[60] animate-fade-in" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-luxe-black/60 backdrop-blur-sm" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 bottom-0 w-72 max-w-[85%] bg-luxe-ink text-luxe-bone p-6 flex flex-col shadow-2xl animate-slide-in-right"
          >
            <div className="flex items-center justify-between">
              <div>
                <Link href="/admin" className="font-serif text-xl text-luxe-gold">Luxe Living</Link>
                <p className="text-[10px] tracking-luxe uppercase text-luxe-muted mt-1">Dashboard</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="w-9 h-9 rounded-full border border-luxe-bone/20 text-luxe-bone/80 hover:text-luxe-gold hover:border-luxe-gold transition-colors flex items-center justify-center"
              >×</button>
            </div>
            <nav className="mt-8 flex flex-col gap-1 text-sm">
              {links.map((l) => {
                const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href + "/"));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-3 py-2.5 rounded transition-colors ${
                      active ? "bg-luxe-gold text-luxe-black" : "text-luxe-bone/80 hover:text-luxe-gold hover:bg-luxe-black/40"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto text-xs text-luxe-muted">
              <p className="truncate">{email}</p>
              <AdminLogout />
              <Link href="/" className="block mt-2 text-luxe-gold/80 hover:text-luxe-gold">← Ver sitio público</Link>
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden lg:flex w-64 bg-luxe-ink text-luxe-bone flex-col p-6 flex-shrink-0">
        <Link href="/admin" className="font-serif text-xl tracking-wide text-luxe-gold">Luxe Living</Link>
        <p className="text-[10px] tracking-luxe uppercase text-luxe-muted mt-1">Dashboard</p>
        <nav className="mt-10 flex flex-col gap-1 text-sm">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href + "/"));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded transition-colors ${
                  active ? "bg-luxe-gold text-luxe-black" : "text-luxe-bone/80 hover:text-luxe-gold hover:bg-luxe-black/40"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto text-xs text-luxe-muted">
          <p className="truncate">{email}</p>
          <AdminLogout />
          <Link href="/" className="block mt-2 text-luxe-gold/80 hover:text-luxe-gold">← Ver sitio público</Link>
        </div>
      </aside>
    </>
  );
}
