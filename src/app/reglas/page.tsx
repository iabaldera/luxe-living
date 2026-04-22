import { getLocale, getTranslations } from "next-intl/server";
import { getRules } from "@/lib/data";

export const dynamic = "force-dynamic";

const ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  silencio: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  ),
  huespedes: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <circle cx="9" cy="8" r="3.5" /><circle cx="17" cy="10" r="2.5" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5M15 20c0-2 2-3.5 4-3.5s3 1 3 3.5" />
    </svg>
  ),
  mascotas: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <circle cx="6" cy="10" r="1.6" /><circle cx="10" cy="6" r="1.6" /><circle cx="14" cy="6" r="1.6" /><circle cx="18" cy="10" r="1.6" />
      <path d="M8 20c-2 0-3-1.5-3-3 0-2.5 3-3 4.5-5 1-1.3 2-2 2.5-2s1.5.7 2.5 2c1.5 2 4.5 2.5 4.5 5 0 1.5-1 3-3 3-1.5 0-2.5-1-4-1s-2.5 1-4 1z" />
    </svg>
  ),
  fumar: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <circle cx="12" cy="12" r="9" /><path d="M5.5 5.5l13 13" />
    </svg>
  ),
  amenidades: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M3 17c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
      <path d="M3 21c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
      <path d="M7 13V6a2 2 0 0 1 2-2h1M17 13V6a2 2 0 0 0-2-2h-1" />
    </svg>
  ),
  checkout: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  ),
};

export default async function RulesPage() {
  const t = await getTranslations("rules");
  const locale = await getLocale();
  const rules = await getRules();
  return (
    <section className="px-6 lg:px-16 py-12 lg:py-20 max-w-content mx-auto">
      <header className="mb-12">
        <p className="text-luxe-gold-deep text-xs tracking-luxe uppercase">Luxe Living</p>
        <h1 className="mt-3 font-serif text-3xl md:text-5xl text-luxe-black">{t("title")}</h1>
        <p className="mt-3 text-luxe-muted text-sm md:text-base">{t("subtitle")}</p>
        <div className="mt-6 h-px w-16 bg-luxe-gold" />
      </header>

      <div className="grid gap-5">
        {rules.map((r, i) => {
          const Icon = ICONS[r.icono] ?? ICONS.silencio;
          const titulo = locale === "en" ? r.titulo_en : r.titulo;
          const desc = locale === "en" ? r.descripcion_en : r.descripcion;
          return (
            <article key={r.id}
              className="group flex gap-5 p-6 bg-white border border-luxe-line rounded-sm hover:shadow-gold hover:border-luxe-gold/40 transition-all duration-200 ease-luxe animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-luxe-gold/60 rounded-full text-luxe-gold-deep">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-luxe-black">{titulo}</h2>
                <p className="mt-2 text-sm text-luxe-muted leading-relaxed">{desc}</p>
              </div>
            </article>
          );
        })}
        {rules.length === 0 && <p className="text-luxe-muted text-sm">No hay reglas configuradas.</p>}
      </div>
    </section>
  );
}
