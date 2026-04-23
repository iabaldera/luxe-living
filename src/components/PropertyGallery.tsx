"use client";
import { useEffect, useMemo, useRef, useState } from "react";

interface Photo { url: string; cat: string }

export default function PropertyGallery({
  fotos, categorias = [], alt,
}: { fotos: string[]; categorias?: string[]; alt: string }) {
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const markBroken = (url: string) => setBroken((s) => { if (s.has(url)) return s; const n = new Set(s); n.add(url); return n; });

  useEffect(() => {
    const pending = fotos.map((u) => (u || "").trim()).filter((u) => u && !broken.has(u));
    const imgs: HTMLImageElement[] = [];
    pending.forEach((u) => {
      const img = new Image();
      img.onerror = () => markBroken(u);
      img.src = u;
      imgs.push(img);
    });
    return () => { imgs.forEach((i) => { i.onerror = null; i.src = ""; }); };
  }, [fotos.join("|")]);

  const photos: Photo[] = fotos
    .map((url, i) => ({ url: (url || "").trim(), cat: (categorias[i] || "").trim() }))
    .filter((p) => p.url && !broken.has(p.url));

  const groups = useMemo(() => {
    const map = new Map<string, Photo[]>();
    for (const p of photos) {
      const key = p.cat || "Otras";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return Array.from(map.entries()).map(([cat, items]) => ({ cat, items }));
  }, [fotos.join("|"), categorias.join("|")]);

  const [tourOpen, setTourOpen] = useState(false);
  const [light, setLight] = useState<number | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeCat, setActiveCat] = useState<string | null>(groups[0]?.cat ?? null);

  useEffect(() => {
    if (!tourOpen && light === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLight(null); if (light === null) setTourOpen(false); }
      if (light !== null) {
        if (e.key === "ArrowRight") setLight((i) => ((i ?? 0) + 1) % photos.length);
        if (e.key === "ArrowLeft") setLight((i) => ((i ?? 0) - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [tourOpen, light, photos.length]);

  if (!photos.length) return null;

  const cover = photos[0].url;
  const rest = photos.slice(1, 5);
  const openAt = (url: string) => {
    const i = photos.findIndex((p) => p.url === url);
    setLight(i >= 0 ? i : 0);
  };
  const scrollToCat = (cat: string) => {
    setActiveCat(cat);
    sectionRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="relative grid grid-cols-4 grid-rows-2 gap-2 mb-10 animate-scale-in rounded-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setTourOpen(true)}
          className="col-span-4 md:col-span-2 row-span-2 h-64 md:h-[420px] bg-luxe-cream bg-cover bg-center transition-transform duration-500 hover:scale-[1.01] relative group"
          style={{ backgroundImage: `url('${cover}')` }}
          aria-label={alt}
        >
          <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        {rest.map((p, i) => (
          <button
            key={p.url + i}
            type="button"
            onClick={() => setTourOpen(true)}
            className="hidden md:block h-[206px] bg-luxe-cream bg-cover bg-center transition-transform duration-500 hover:scale-[1.02] relative overflow-hidden group"
            style={{ backgroundImage: `url('${p.url}')` }}
          >
            <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setTourOpen(true)}
          className="absolute bottom-3 right-3 z-10 px-4 py-2 bg-white border border-luxe-black/20 rounded-sm text-xs tracking-luxe uppercase text-luxe-black shadow-soft hover:border-luxe-gold hover:text-luxe-gold-deep transition-all flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="5" width="18" height="14" rx="1" /><circle cx="9" cy="11" r="2" /><path d="m21 17-6-6-7 8" />
          </svg>
          Mostrar las {fotos.length} fotos
        </button>
      </div>

      {tourOpen && (
        <div className="fixed inset-0 z-[9999] bg-luxe-bone animate-fade-in overflow-y-auto pt-16 lg:pt-0">
          <header className="sticky top-0 z-[10000] bg-luxe-bone/95 backdrop-blur border-b border-luxe-line">
            <div className="flex items-center justify-between gap-3 px-4 md:px-8 py-2.5">
              <button onClick={() => setTourOpen(false)} aria-label="Cerrar galería" className="flex items-center gap-1.5 text-luxe-black hover:text-luxe-gold-deep transition-colors text-xs tracking-luxe uppercase">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 6l-6 6 6 6"/></svg>
                <span className="hidden sm:inline">Volver</span>
              </button>
              <h2 className="font-serif text-sm md:text-base text-luxe-black truncate">Recorrido fotográfico</h2>
              <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{fotos.length} fotos</span>
            </div>
            {groups.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-thin px-4 md:px-8 pb-2">
                {groups.map((g) => (
                  <button
                    key={g.cat}
                    onClick={() => scrollToCat(g.cat)}
                    className={`flex-shrink-0 flex flex-col items-start gap-1 transition-all ${
                      activeCat === g.cat ? "opacity-100" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`w-16 h-12 md:w-20 md:h-14 bg-cover bg-center rounded-sm border-2 transition-colors ${
                        activeCat === g.cat ? "border-luxe-black" : "border-transparent"
                      }`}
                      style={{ backgroundImage: `url('${g.items[0].url}')` }}
                    />
                    <span className={`text-[10px] tracking-luxe uppercase ${activeCat === g.cat ? "text-luxe-black border-b border-luxe-black pb-px" : "text-luxe-muted"}`}>
                      {g.cat}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </header>

          <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-8">
            {groups.map((g) => (
              <section
                key={g.cat}
                ref={(el: HTMLElement | null) => { sectionRefs.current[g.cat] = el as HTMLDivElement | null; }}
                className="animate-slide-up"
              >
                <h3 className="font-serif text-2xl md:text-3xl text-luxe-black mb-4">{g.cat}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {g.items.map((p, i) => (
                    <button
                      key={p.url + i}
                      onClick={() => openAt(p.url)}
                      className={`bg-cover bg-center rounded-sm transition-transform duration-300 hover:scale-[1.01] overflow-hidden ${
                        i === 0 && g.items.length > 1 ? "sm:col-span-2 aspect-[16/10]" : "aspect-[4/3]"
                      }`}
                      style={{ backgroundImage: `url('${p.url}')` }}
                      aria-label={`${g.cat} ${i + 1}`}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {light !== null && (
        <div className="fixed inset-0 z-[10000] bg-luxe-black/95 flex flex-col animate-fade-in pt-16 lg:pt-0">
          <div className="flex items-center justify-between px-5 py-3 text-luxe-bone">
            <span className="text-xs tracking-luxe uppercase">
              {light + 1} / {photos.length}{photos[light].cat ? ` · ${photos[light].cat}` : ""}
            </span>
            <button
              onClick={() => setLight(null)}
              aria-label="Cerrar"
              className="w-10 h-10 rounded-full bg-luxe-black/60 border border-luxe-gold/50 text-luxe-bone hover:bg-luxe-gold hover:text-luxe-black transition-colors flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center relative px-4 min-h-0">
            <button
              onClick={() => setLight((i) => ((i ?? 0) - 1 + photos.length) % photos.length)}
              className="absolute left-4 md:left-8 w-10 h-10 rounded-full border border-luxe-gold/60 text-luxe-bone hover:bg-luxe-gold hover:text-luxe-black transition-colors flex items-center justify-center z-10"
              aria-label="Anterior"
            >‹</button>
            <img
              src={photos[light].url}
              alt={`${alt} ${light + 1}`}
              className="max-h-full max-w-full object-contain animate-fade-in"
              key={light}
            />
            <button
              onClick={() => setLight((i) => ((i ?? 0) + 1) % photos.length)}
              className="absolute right-4 md:right-8 w-10 h-10 rounded-full border border-luxe-gold/60 text-luxe-bone hover:bg-luxe-gold hover:text-luxe-black transition-colors flex items-center justify-center z-10"
              aria-label="Siguiente"
            >›</button>
          </div>
          <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-thin border-t border-luxe-bone/10">
            {photos.map((p, i) => (
              <button
                key={p.url + i}
                onClick={() => setLight(i)}
                className={`flex-shrink-0 w-16 h-12 bg-cover bg-center rounded-sm border-2 transition-all ${
                  i === light ? "border-luxe-gold scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
                style={{ backgroundImage: `url('${p.url}')` }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
