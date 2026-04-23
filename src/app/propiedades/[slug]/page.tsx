import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import ReservationForm from "@/components/ReservationForm";
import PropertyGallery from "@/components/PropertyGallery";
import { getProperty, getContact } from "@/lib/data";
import { amenityIcon, amenityLabel } from "@/lib/amenityCatalog";

export const dynamic = "force-dynamic";

export default async function PropertyDetail({ params }: { params: { slug: string } }) {
  const t = await getTranslations("properties");
  const locale = await getLocale();
  const property = await getProperty(params.slug);
  if (!property) return notFound();
  const contact = await getContact();

  const nombre = locale === "en" ? property.nombre_en : property.nombre;
  const ubicacion = locale === "en" ? property.ubicacion_en : property.ubicacion;
  const descripcion = locale === "en" ? property.descripcion_en : property.descripcion;
  const cancel = locale === "en" ? property.politica_cancelacion_en : property.politica_cancelacion;
  const fotos = property.fotos ?? [];
  const destacados = property.destacados ?? [];

  const facts: Array<{ label: string; value: string }> = [];
  if (property.tipo) facts.push({ label: locale === "en" ? "Type" : "Tipo", value: property.tipo });
  if (property.piso) facts.push({ label: locale === "en" ? "Floor" : "Piso", value: property.piso });
  if (property.area_m2) facts.push({ label: locale === "en" ? "Area" : "Área", value: `${property.area_m2} m²` });
  if (property.camas) facts.push({ label: locale === "en" ? "Beds" : "Camas", value: String(property.camas) });
  if (property.check_in_hora) facts.push({ label: "Check-in", value: property.check_in_hora });
  if (property.check_out_hora) facts.push({ label: "Check-out", value: property.check_out_hora });
  if (property.min_noches) facts.push({ label: locale === "en" ? "Min. nights" : "Mín. noches", value: String(property.min_noches) });

  return (
    <section className="px-6 lg:px-16 py-10 lg:py-16 max-w-5xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <p className="text-luxe-gold-deep text-xs tracking-luxe uppercase">{ubicacion}</p>
        <h1 className="mt-2 font-serif text-3xl md:text-5xl text-luxe-black animate-slide-up">{nombre}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-luxe-muted animate-slide-up" style={{ animationDelay: "120ms" }}>
          <span>{property.huespedes} {t("guests")}</span>
          <span className="w-1 h-1 rounded-full bg-luxe-line" />
          <span>{property.habitaciones} {t("bedrooms")}</span>
          <span className="w-1 h-1 rounded-full bg-luxe-line" />
          <span>{property.banos} {t("bathrooms")}</span>
          <span className="w-1 h-1 rounded-full bg-luxe-line" />
          <span className="font-serif text-luxe-black">${property.precio_noche} {property.moneda} / {t("perNight")}</span>
        </div>
      </header>

      <PropertyGallery fotos={fotos} alt={nombre} />

      {destacados.length > 0 && (
        <div className="mb-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {destacados.map((d, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-white border border-luxe-line rounded-sm animate-slide-up hover:border-luxe-gold/50 hover:shadow-gold transition-all duration-300 ease-luxe" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-luxe-gold flex-shrink-0" />
              <span className="text-sm text-luxe-black">{d}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <h2 className="font-serif text-2xl text-luxe-black">{t("about")}</h2>
          <p className="mt-3 text-luxe-muted leading-relaxed whitespace-pre-line">{descripcion}</p>

          {facts.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
              {facts.map((f, i) => (
                <div key={f.label} className="p-3 bg-luxe-bone/60 border border-luxe-line rounded-sm animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <p className="text-[10px] tracking-luxe uppercase text-luxe-muted">{f.label}</p>
                  <p className="mt-1 text-sm font-serif text-luxe-black capitalize">{f.value}</p>
                </div>
              ))}
            </div>
          )}

          {property.amenidades.length > 0 && (
            <>
              <h3 className="mt-10 font-serif text-xl text-luxe-black">{t("amenities")}</h3>
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-luxe-black">
                {property.amenidades.map((a, i) => {
                  const Icon = amenityIcon(a);
                  return (
                    <li
                      key={a}
                      className="flex items-center gap-3 group animate-slide-up"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border border-luxe-gold/40 text-luxe-gold-deep bg-luxe-bone/50 transition-all duration-300 ease-luxe group-hover:bg-luxe-gold group-hover:text-luxe-black group-hover:scale-110">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span>{amenityLabel(a, locale)}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {cancel && (
            <div className="mt-10 p-5 border border-luxe-line rounded-sm bg-luxe-bone/40 animate-fade-in">
              <h3 className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">
                {locale === "en" ? "Cancellation policy" : "Política de cancelación"}
              </h3>
              <p className="mt-2 text-sm text-luxe-muted leading-relaxed whitespace-pre-line">{cancel}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <ReservationForm property={property} contact={contact} />
          </div>
        </div>
      </div>
    </section>
  );
}
