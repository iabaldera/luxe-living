import { getTranslations } from "next-intl/server";
import PropertyCard from "@/components/PropertyCard";
import ContactAssistant from "@/components/ContactAssistant";
import { getProperties, getContact } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PropiedadesPage() {
  const t = await getTranslations("properties");
  const [items, contact] = await Promise.all([getProperties(), getContact()]);
  return (
    <section className="px-6 lg:px-16 py-12 lg:py-20 max-w-5xl mx-auto">
      <header className="mb-12">
        <p className="text-luxe-gold-deep text-xs tracking-luxe uppercase">Luxe Living</p>
        <h1 className="mt-3 font-serif text-3xl md:text-5xl text-luxe-black">{t("title")}</h1>
        <p className="mt-3 text-luxe-muted text-sm md:text-base">{t("subtitle")}</p>
        <div className="mt-6 h-px w-16 bg-luxe-gold" />
      </header>

      <div className="mb-12 animate-slide-up">
        <ContactAssistant contact={contact} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {items.map((p, i) => (
          <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <PropertyCard p={p} />
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-luxe-muted text-sm col-span-2">No hay propiedades disponibles.</p>
        )}
      </div>
    </section>
  );
}
