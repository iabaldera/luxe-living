"use client";
import { useEffect, useState } from "react";

export default function PropertyGallery({ fotos, alt }: { fotos: string[]; alt: string }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % fotos.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + fotos.length) % fotos.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, fotos.length]);

  if (!fotos.length) return null;

  const openAt = (i: number) => { setIdx(i); setOpen(true); };
  const cover = fotos[0];
  const rest = fotos.slice(1);

  return (
    <>
      <div className="grid grid-cols-4 gap-3 mb-10 animate-scale-in">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="col-span-4 md:col-span-2 md:row-span-2 h-64 md:h-[420px] bg-luxe-cream bg-cover bg-center rounded-sm transition-transform duration-500 hover:scale-[1.01] overflow-hidden relative group"
          style={{ backgroundImage: `url('${cover}')` }}
          aria-label={alt}
        >
          <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        {rest.slice(0, 4).map((f, i) => {
          const realIdx = i + 1;
          const isLast = i === 3 && rest.length > 4;
          return (
            <button
              key={f + i}
              type="button"
              onClick={() => openAt(isLast ? 0 : realIdx)}
              className="hidden md:block h-[204px] bg-luxe-cream bg-cover bg-center rounded-sm transition-transform duration-500 hover:scale-[1.02] relative overflow-hidden group"
              style={{ backgroundImage: `url('${f}')` }}
            >
              <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {isLast && (
                <span className="absolute inset-0 bg-luxe-black/55 flex flex-col items-center justify-center text-luxe-bone">
                  <span className="font-serif text-3xl">+{fotos.length - 4}</span>
                  <span className="text-[10px] tracking-luxe uppercase mt-1">Ver todas</span>
                </span>
              )}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="md:hidden col-span-4 text-xs tracking-luxe uppercase border border-luxe-line rounded-sm py-2.5 text-luxe-black hover:border-luxe-gold hover:text-luxe-gold-deep transition-colors"
        >
          Ver {fotos.length} fotos
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[9999] bg-luxe-black/95 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between px-5 py-4 text-luxe-bone">
            <span className="text-xs tracking-luxe uppercase">{idx + 1} / {fotos.length}</span>
            <button onClick={() => setOpen(false)} className="text-luxe-bone hover:text-luxe-gold text-2xl leading-none">×</button>
          </div>
          <div className="flex-1 flex items-center justify-center relative px-4 pb-4">
            <button
              onClick={() => setIdx((i) => (i - 1 + fotos.length) % fotos.length)}
              className="absolute left-4 md:left-8 w-10 h-10 rounded-full border border-luxe-gold/60 text-luxe-bone hover:bg-luxe-gold hover:text-luxe-black transition-colors flex items-center justify-center"
              aria-label="Anterior"
            >‹</button>
            <img
              src={fotos[idx]}
              alt={`${alt} ${idx + 1}`}
              className="max-h-full max-w-full object-contain animate-fade-in"
              key={idx}
            />
            <button
              onClick={() => setIdx((i) => (i + 1) % fotos.length)}
              className="absolute right-4 md:right-8 w-10 h-10 rounded-full border border-luxe-gold/60 text-luxe-bone hover:bg-luxe-gold hover:text-luxe-black transition-colors flex items-center justify-center"
              aria-label="Siguiente"
            >›</button>
          </div>
          <div className="px-4 pb-5 flex gap-2 overflow-x-auto scrollbar-thin">
            {fotos.map((f, i) => (
              <button
                key={f + i}
                onClick={() => setIdx(i)}
                className={`flex-shrink-0 w-20 h-14 bg-cover bg-center rounded-sm border-2 transition-all ${
                  i === idx ? "border-luxe-gold scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
                style={{ backgroundImage: `url('${f}')` }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
