"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

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

        <div ref={filterRef} className="relative self-start">
          {(() => {
            const ActiveIcon = CAT_ICONS[active];
            return (
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border bg-luxe-bone/95 backdrop-blur text-luxe-black border-luxe-line hover:border-luxe-gold/60 text-[11px] tracking-luxe uppercase shadow-soft"
              >
                <ActiveIcon className="w-3.5 h-3.5" />
                <span>{t(`categories.${active}`)}{sub ? ` · ${subLabel(sub)}` : ""}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-luxe-line/60">{counts[active] ?? 0}</span>
                <svg viewBox="0 0 24 24" className={`w-3 h-3 transition-transform ${filterOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            );
          })()}
          {filterOpen && (
            <div className="absolute top-full mt-2 left-0 z-[1001] w-[260px] max-h-[70vh] overflow-y-auto bg-luxe-bone border border-luxe-line rounded-sm shadow-xl">
              <div className="px-3 py-2 border-b border-luxe-line text-[10px] tracking-luxe uppercase text-luxe-muted">
                {locale === "en" ? "Category" : "Categoría"}
              </div>
              {CATS.map((c) => {
                const Icon = CAT_ICONS[c];
                const isActive = active === c;
                return (
                  <button key={c} onClick={() => { pickCat(c); if (c === "all" || c === "estancias") setFilterOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-[11px] tracking-luxe uppercase transition-colors border-b border-luxe-line/50 ${
                      isActive ? "bg-luxe-black text-luxe-bone" : "text-luxe-black hover:bg-luxe-cream"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{t(`categories.${c}`)}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-luxe-bone/20" : "bg-luxe-line/60"}`}>
                      {counts[c] ?? 0}
                    </span>
                  </button>
                );
              })}
              {subcats.length > 0 && (
                <>
                  <div className="px-3 py-2 border-b border-luxe-line text-[10px] tracking-luxe uppercase text-luxe-muted bg-luxe-cream/50">
                    {locale === "en" ? "Subcategory" : "Subcategoría"}
                  </div>
                  <button onClick={() => { setSub(null); setFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-[10px] tracking-luxe uppercase border-b border-luxe-line/50 ${
                      sub === null ? "bg-luxe-gold text-luxe-black" : "text-luxe-muted hover:bg-luxe-cream"
                    }`}>
                    {locale === "en" ? "All" : "Todas"}
                  </button>
                  {subcats.map((s) => (
                    <button key={s} onClick={() => { setSub(s); setFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-[10px] tracking-luxe uppercase border-b border-luxe-line/50 ${
                        sub === s ? "bg-luxe-gold text-luxe-black" : "text-luxe-muted hover:bg-luxe-cream"
                      }`}>
                      {subLabel(s)}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
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
