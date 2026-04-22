"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { setLocaleCookie } from "@/app/actions";

export default function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const [pending, start] = useTransition();

  const set = (l: "es" | "en") => {
    if (l === locale || pending) return;
    start(async () => {
      await setLocaleCookie(l);
    });
  };

  const base = "text-xs tracking-luxe uppercase transition-colors duration-150";
  const active = "text-luxe-black";
  const inactive = "text-luxe-muted hover:text-luxe-black";

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "px-3"}`}>
      <button onClick={() => set("es")} className={`${base} ${locale === "es" ? active : inactive}`}>
        ES
      </button>
      <span className="text-luxe-line">|</span>
      <button onClick={() => set("en")} className={`${base} ${locale === "en" ? active : inactive}`}>
        EN
      </button>
    </div>
  );
}
