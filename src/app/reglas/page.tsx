import { getLocale, getTranslations } from "next-intl/server";
import { getRules } from "@/lib/data";
import { RULE_ICONS } from "@/lib/ruleIcons";

export const dynamic = "force-dynamic";

export default async function RulesPage() {
  const t = await getTranslations("rules");
  const locale = await getLocale();
  const rules = await getRules();
  return (
    <section className="px-6 lg:px-16 py-12 lg:py-20 max-w-content mx-auto">
      <header className="mb-12">
        <p className="text-luxe-gold-deep text-xs tracking-luxe uppercase animate-fade-in">Luxe Living</p>
        <h1 className="mt-3 font-serif text-3xl md:text-5xl text-luxe-black animate-slide-up">{t("title")}</h1>
        <p className="mt-3 text-luxe-muted text-sm md:text-base animate-slide-up" style={{ animationDelay: "120ms" }}>
          {t("subtitle")}
        </p>
        <div className="mt-6 h-px bg-luxe-gold animate-gold-line" />
      </header>

      <div className="grid gap-5">
        {rules.map((r, i) => {
          const Icon = RULE_ICONS[r.icono] ?? RULE_ICONS.info;
          const titulo = locale === "en" ? r.titulo_en : r.titulo;
          const desc = locale === "en" ? r.descripcion_en : r.descripcion;
          return (
            <article
              key={r.id}
              className="group relative flex gap-5 p-6 bg-white border border-luxe-line rounded-sm hover:shadow-gold hover:border-luxe-gold/50 hover:-translate-y-0.5 transition-all duration-300 ease-luxe animate-slide-up overflow-hidden"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="absolute left-0 top-0 h-full w-0 bg-luxe-gold/60 transition-all duration-300 ease-luxe group-hover:w-1" />
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-luxe-gold/60 rounded-full text-luxe-gold-deep bg-luxe-bone/40 transition-all duration-300 ease-luxe group-hover:bg-luxe-gold group-hover:text-luxe-black group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-gold">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-xl text-luxe-black transition-colors duration-200 group-hover:text-luxe-gold-deep">
                  {titulo}
                </h2>
                <p className="mt-2 text-sm text-luxe-muted leading-relaxed">{desc}</p>
              </div>
            </article>
          );
        })}
        {rules.length === 0 && (
          <p className="text-luxe-muted text-sm animate-fade-in">No hay reglas configuradas.</p>
        )}
      </div>
    </section>
  );
}
