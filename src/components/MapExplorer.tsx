"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { PlaceRow, PropertyRow } from "@/lib/supabase/types";
import PlaceCard from "./PlaceCard";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

type Cat = PlaceRow["categoria"] | "estancias";
const CATS: Array<Cat | "all"> = ["all", "estancias", "turismo", "gastronomia", "entretenimiento"];

const CAT_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  all: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3v18" />
    </svg>
  ),
  turismo: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M12 2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9z" />
    </svg>
  ),
  gastronomia: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M6 3v8a3 3 0 0 0 6 0V3M9 3v18M16 3c-1.5 2-2 4-2 6s.5 3 2 3v9" />
    </svg>
  ),
  entretenimiento: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  ),
  estancias: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z" />
    </svg>
  ),
};

export default function MapExplorer({
  places: placesData,
  properties: propertiesData = [],
  initialCategory = "all" as Cat | "all",
}: { places: PlaceRow[]; properties?: PropertyRow[]; initialCategory?: Cat | "all" }) {
  const t = useTranslations("map");
  const locale = useLocale();
  const [active, setActive] = useState<Cat | "all">(initialCategory);
  const [sub, setSub] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PlaceRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const propsWithCoords = useMemo(() => propertiesData.filter((p) => p.lat != null && p.lng != null), [propertiesData]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: placesData.length + propsWithCoords.length, estancias: propsWithCoords.length };
    for (const p of placesData) c[p.categoria] = (c[p.categoria] ?? 0) + 1;
    return c;
  }, [placesData, propsWithCoords]);

  const subcats = useMemo(() => {
    if (active === "all" || active === "estancias") return [];
    const set = new Set<string>();
    for (const p of placesData) if (p.categoria === active && p.subcategoria) set.add(p.subcategoria);
    return Array.from(set).sort();
  }, [active, placesData]);

  const places = useMemo(() => {
    if (active === "estancias") return [];
    const q = query.trim().toLowerCase();
    return placesData.filter((p) => {
      if (active !== "all" && p.categoria !== active) return false;
      if (sub && p.subcategoria !== sub) return false;
      if (!q) return true;
      const hay = `${p.nombre} ${p.nombre_en ?? ""} ${p.descripcion ?? ""} ${p.descripcion_en ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [active, sub, query, placesData]);

  const properties = useMemo(() => {
    if (active !== "all" && active !== "estancias") return [];
    const q = query.trim().toLowerCase();
    return propsWithCoords.filter((p) => {
      if (!q) return true;
      const hay = `${p.nombre} ${p.nombre_en ?? ""} ${p.ubicacion ?? ""} ${p.descripcion ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [active, query, propsWithCoords]);

  const pickCat = (c: Cat | "all") => { setActive(c); setSub(null); };
  const subLabel = (s: string) => s.replace(/-/g, " ");

  return (
    <section className="relative h-[calc(100vh-4rem)] lg:h-screen">
      <div className="absolute top-4 left-4 right-4 lg:right-[376px] z-[1000] flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-luxe-bone/95 backdrop-blur border border-luxe-line rounded-full pl-4 pr-2 py-1.5 shadow-soft">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-luxe-muted flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === "en" ? "Search places…" : "Buscar lugares…"}
            className="flex-1 bg-transparent outline-none text-sm text-luxe-black placeholder:text-luxe-muted py-1"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-luxe-muted hover:text-luxe-black text-xs px-2">×</button>
          )}
          <span className="text-[10px] tracking-luxe uppercase text-luxe-muted border-l border-luxe-line pl-3 pr-1">
            {places.length + properties.length}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-thin -mx-1 px-1 pb-1">
          {CATS.map((c) => {
            const Icon = CAT_ICONS[c];
            const isActive = active === c;
            return (
              <button
                key={c}
                onClick={() => pickCat(c)}
                className={`flex items-center gap-2 flex-shrink-0 px-3.5 py-2 rounded-full border text-[11px] tracking-luxe uppercase transition-all duration-150 ${
                  isActive
                    ? "bg-luxe-black text-luxe-bone border-luxe-black shadow-gold"
                    : "bg-luxe-bone/95 backdrop-blur text-luxe-black border-luxe-line hover:border-luxe-gold/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t(`categories.${c}`)}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-luxe-bone/20" : "bg-luxe-line/60"}`}>
                  {counts[c] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {subcats.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-thin -mx-1 px-1 pb-1">
            <button
              onClick={() => setSub(null)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-[10px] tracking-luxe uppercase transition-colors ${
                sub === null ? "bg-luxe-gold text-luxe-black" : "bg-luxe-bone/95 backdrop-blur border border-luxe-line text-luxe-muted hover:text-luxe-black"
              }`}
            >
              {locale === "en" ? "All" : "Todas"}
            </button>
            {subcats.map((s) => (
              <button
                key={s}
                onClick={() => setSub(s)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-[10px] tracking-luxe uppercase transition-colors ${
                  sub === s ? "bg-luxe-gold text-luxe-black" : "bg-luxe-bone/95 backdrop-blur border border-luxe-line text-luxe-muted hover:text-luxe-black"
                }`}
              >
                {subLabel(s)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-0">
        <LeafletMap
          places={places}
          properties={properties}
          selected={selected}
          onSelect={setSelected}
          locale={locale}
          t={{
            openInMaps: t("openInMaps"),
            cat: (k: string) => t(`categories.${k}`),
            viewProperty: locale === "en" ? "View stay" : "Ver estancia",
          }}
        />
      </div>

      <aside className="hidden lg:block absolute top-0 right-0 bottom-0 w-[360px] bg-luxe-bone border-l border-luxe-line overflow-y-auto scrollbar-thin z-[500]">
        <div className="p-6">
          <h2 className="font-serif text-2xl text-luxe-black">{t("title")}</h2>
          <p className="mt-1 text-sm text-luxe-muted">{t("subtitle")}</p>
          <div className="mt-6 grid gap-4">
            {places.map((p, i) => (
              <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <PlaceCard place={p} onClick={() => setSelected(p)} />
              </div>
            ))}
            {places.length === 0 && (
              <p className="text-sm text-luxe-muted text-center py-8">
                {locale === "en" ? "No places match your filters." : "Ningún lugar coincide con los filtros."}
              </p>
            )}
          </div>
        </div>
      </aside>

      <div
        className={`lg:hidden absolute inset-x-0 bottom-0 z-[500] transition-transform duration-300 ease-luxe ${
          sheetOpen ? "translate-y-0" : "translate-y-[calc(100%-5rem)]"
        }`}
      >
        <div className="bg-luxe-bone border-t border-luxe-line rounded-t-2xl shadow-soft max-h-[70vh] flex flex-col">
          <button onClick={() => setSheetOpen((v) => !v)} className="flex flex-col items-center py-3">
            <span className="h-1 w-10 rounded-full bg-luxe-line" />
            <span className="mt-2 text-[11px] tracking-luxe uppercase text-luxe-muted">
              {places.length} · {t("title")}
            </span>
          </button>
          <div className="px-4 pb-24 overflow-y-auto scrollbar-thin grid gap-3">
            {places.map((p) => (
              <PlaceCard key={p.id} place={p} compact onClick={() => setSelected(p)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
