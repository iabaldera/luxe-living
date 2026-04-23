"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { PropertyRow } from "@/lib/supabase/types";

export default function PropertyCard({ p }: { p: PropertyRow }) {
  const locale = useLocale();
  const t = useTranslations("properties");
  const nombre = locale === "en" ? p.nombre_en : p.nombre;
  const ubicacion = locale === "en" ? p.ubicacion_en : p.ubicacion;
  const cover = p.fotos?.[0] ?? "";

  return (
    <Link
      href={`/propiedades/${p.slug}`}
      className="group block bg-white border border-luxe-line rounded-sm overflow-hidden transition-all duration-200 ease-luxe hover:border-luxe-gold/50 hover:shadow-gold"
    >
      {cover && (
        <div
          className="h-56 w-full bg-luxe-cream bg-cover bg-center transition-transform duration-500 ease-luxe group-hover:scale-[1.02]"
          style={{ backgroundImage: `url('${cover}')` }}
        />
      )}
      <div className="p-5">
        <p className="text-[10px] tracking-luxe uppercase text-luxe-gold-deep">{ubicacion}</p>
        <h3 className="mt-1 font-serif text-xl text-luxe-black">{nombre}</h3>
        <div className="mt-3 flex items-center gap-3 text-xs text-luxe-muted">
          <span>{p.huespedes} {t("guests")}</span>
          <span className="w-1 h-1 rounded-full bg-luxe-line" />
          <span>{p.habitaciones} {t("bedrooms")}</span>
          <span className="w-1 h-1 rounded-full bg-luxe-line" />
          <span>{p.banos} {t("bathrooms")}</span>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="font-serif text-2xl text-luxe-black">${p.precio_noche}</span>
            <span className="text-xs text-luxe-muted ml-1">{p.moneda} · {t("perNight")}</span>
          </div>
          <span className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep border-b border-luxe-gold/50 pb-0.5 group-hover:text-luxe-black group-hover:border-luxe-black transition-colors">
            {t("viewDetails")} →
          </span>
        </div>
      </div>
    </Link>
  );
}
