import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import ReservationForm from "@/components/ReservationForm";
import { getProperty, getContact } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PropertyDetail({ params }: { params: { slug: string } }) {
  const t = await getTranslations("properties");
  const tA = await getTranslations("amenities");
  const locale = await getLocale();
  const property = await getProperty(params.slug);
  if (!property) return notFound();
  const contact = await getContact();

  const nombre = locale === "en" ? property.nombre_en : property.nombre;
  const ubicacion = locale === "en" ? property.ubicacion_en : property.ubicacion;
  const descripcion = locale === "en" ? property.descripcion_en : property.descripcion;
  const fotos = property.fotos ?? [];

  return (
    <section className="px-6 lg:px-16 py-10 lg:py-16 max-w-5xl mx-auto">
      <header className="mb-8">
        <p className="text-luxe-gold-deep text-xs tracking-luxe uppercase">{ubicacion}</p>
        <h1 className="mt-2 font-serif text-3xl md:text-5xl text-luxe-black">{nombre}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-luxe-muted">
          <span>{property.huespedes} {t("guests")}</span>
          <span className="w-1 h-1 rounded-full bg-luxe-line" />
          <span>{property.habitaciones} {t("bedrooms")}</span>
          <span className="w-1 h-1 rounded-full bg-luxe-line" />
          <span>{property.banos} {t("bathrooms")}</span>
          <span className="w-1 h-1 rounded-full bg-luxe-line" />
          <span className="font-serif text-luxe-black">${property.precio_noche} {property.moneda} / {t("perNight")}</span>
        </div>
      </header>

      {fotos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div
            className="col-span-3 md:col-span-2 row-span-2 h-64 md:h-[420px] bg-luxe-cream bg-cover bg-center rounded-sm"
            style={{ backgroundImage: `url('${fotos[0]}')` }}
          />
          {fotos.slice(1, 3).map((f) => (
            <div key={f} className="hidden md:block h-[206px] bg-luxe-cream bg-cover bg-center rounded-sm"
              style={{ backgroundImage: `url('${f}')` }} />
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <h2 className="font-serif text-2xl text-luxe-black">{t("about")}</h2>
          <p className="mt-3 text-luxe-muted leading-relaxed">{descripcion}</p>

          {property.amenidades.length > 0 && (
            <>
              <h3 className="mt-10 font-serif text-xl text-luxe-black">{t("amenities")}</h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-luxe-black">
                {property.amenidades.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxe-gold" />
                    {tA(a as any)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="lg:col-span-2">
          <ReservationForm property={property} contact={contact} />
        </div>
      </div>
    </section>
  );
}
