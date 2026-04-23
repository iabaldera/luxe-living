"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import LocaleSwitcher from "./LocaleSwitcher";
import AccountButton from "./AccountButton";

const NAV = [
  { href: "/", key: "home", icon: HomeIcon },
  { href: "/propiedades", key: "stays", icon: BedIcon },
  { href: "/reglas", key: "rules", icon: RulesIcon },
  { href: "/mapa", key: "explore", icon: MapIcon },
] as const;

export default function Shell({ children, logoUrl, brand }: { children: React.ReactNode; logoUrl?: string | null; brand?: string }) {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();
  const brandName = brand || tBrand("name");
  const [showBar, setShowBar] = useState(true);
  const isSplash = pathname === "/";

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setShowBar(y < lastY || y < 20);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-luxe-line bg-luxe-bone px-8 py-10">
        <Link href="/" className="flex items-center gap-2 font-serif text-2xl tracking-wide text-luxe-black">
          {logoUrl ? <img src={logoUrl} alt={brandName} className="max-h-10 w-auto object-contain" /> : brandName}
        </Link>
        <nav className="mt-14 flex flex-col gap-2">
          {NAV.map(({ href, key, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 py-3 px-3 rounded-md transition-all duration-200 ease-luxe ${
                  active ? "text-luxe-black bg-luxe-cream" : "text-luxe-muted hover:text-luxe-black"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm tracking-wide">{t(key)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center gap-3">
          <AccountButton />
          <LocaleSwitcher />
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 pb-24 lg:pb-0">
        {!isSplash && (
          <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-luxe-bone/90 backdrop-blur border-b border-luxe-line">
            <Link href="/" className="flex items-center gap-2 font-serif text-lg tracking-wide">
              {logoUrl ? <img src={logoUrl} alt={brandName} className="max-h-7 w-auto object-contain" /> : brandName}
            </Link>
            <div className="flex items-center gap-2">
              <AccountButton compact />
              <LocaleSwitcher compact />
            </div>
          </header>
        )}
        <div className="animate-fade-in">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className={`lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-luxe-line bg-luxe-bone/95 backdrop-blur transition-transform duration-300 ease-luxe ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <ul className="grid grid-cols-4">
          {NAV.map(({ href, key, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex flex-col items-center gap-1 py-3 text-[11px] tracking-luxe uppercase ${
                    active ? "text-luxe-black" : "text-luxe-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t(key)}</span>
                  <span className={`h-[2px] w-6 rounded-full ${active ? "bg-luxe-gold" : "bg-transparent"}`} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z" />
    </svg>
  );
}
function RulesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5M8 13h8M8 17h6" />
    </svg>
  );
}
function BedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M3 18v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8M3 14h18M7 10h4v2H7z" />
    </svg>
  );
}
function MapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2z" />
      <path d="M9 3v16M15 5v16" />
    </svg>
  );
}
