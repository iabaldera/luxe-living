"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { PlaceRow } from "@/lib/supabase/types";
import PlaceCard from "./PlaceCard";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

type Cat = PlaceRow["categoria"];
const CATS: Array<Cat | "all"> = ["all", "turismo", "gastronomia", "entretenimiento"];

export default function MapExplorer({
  places: placesData,
  initialCategory = "all" as Cat | "all",
}: { places: PlaceRow[]; initialCategory?: Cat | "all" }) {
  const t = useTranslations("map");
  const locale = useLocale();
  const [active, setActive] = useState<Cat | "all">(initialCategory);
  const [selected, setSelected] = useState<PlaceRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const places = useMemo(
    () => (active === "all" ? placesData : placesData.filter((p) => p.categoria === active)),
    [active, placesData]
  );

  return (
    <section className="relative h-[calc(100vh-4rem)] lg:h-screen">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-2 bg-luxe-bone/95 backdrop-blur border border-luxe-line rounded-full px-2 py-1.5 shadow-soft">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`text-[11px] tracking-luxe uppercase px-3 py-1.5 rounded-full transition-colors duration-150 ${
              active === c ? "bg-luxe-black text-luxe-bone" : "text-luxe-muted hover:text-luxe-black"
            }`}
          >
            {t(`categories.${c}`)}
          </button>
        ))}
      </div>

      <div className="absolute inset-0">
        <LeafletMap
          places={places}
          selected={selected}
          onSelect={setSelected}
          locale={locale}
          t={{
            openInMaps: t("openInMaps"),
            cat: (k: string) => t(`categories.${k}`),
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
