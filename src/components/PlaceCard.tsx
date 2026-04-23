"use client";

import { useLocale, useTranslations } from "next-intl";
import type { PlaceRow } from "@/lib/supabase/types";

export default function PlaceCard({
  place,
  onClick,
  compact = false,
}: {
  place: PlaceRow;
  onClick?: () => void;
  compact?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("map");
  const name = locale === "en" ? place.nombre_en : place.nombre;
  const desc = locale === "en" ? place.descripcion_en : place.descripcion;
  const catLabel = t(`categories.${place.categoria}`);

  return (
    <article
      onClick={onClick}
      className={`group bg-white border border-luxe-line rounded-sm overflow-hidden cursor-pointer transition-all duration-200 ease-luxe hover:border-luxe-gold/50 hover:shadow-gold ${
        compact ? "flex gap-3 p-3" : ""
      }`}
    >
      {place.foto && (
        <div
          className={`${compact ? "w-20 h-20 flex-shrink-0" : "h-40 w-full"} bg-luxe-cream bg-cover bg-center`}
          style={{ backgroundImage: `url('${place.foto}')` }}
        />
      )}
      <div className={compact ? "flex-1 min-w-0" : "p-4"}>
        <p className="text-[10px] tracking-luxe uppercase text-luxe-gold-deep">{catLabel}</p>
        <h3 className="mt-1 font-serif text-base text-luxe-black truncate">{name}</h3>
        <p className={`mt-1 text-xs text-luxe-muted ${compact ? "line-clamp-2" : ""}`}>{desc}</p>
        {!compact && (
          <a
            href={place.google_maps_url ?? `https://maps.google.com/?q=${place.lat},${place.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-[11px] tracking-luxe uppercase text-luxe-gold-deep border-b border-luxe-gold/50 pb-0.5 hover:text-luxe-black hover:border-luxe-black transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {t("openInMaps")} →
          </a>
        )}
      </div>
    </article>
  );
}
