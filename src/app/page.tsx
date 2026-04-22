import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function SplashPage({
  searchParams,
}: {
  searchParams: { propiedad?: string };
}) {
  const t = await getTranslations("splash");
  const propertyName = searchParams.propiedad
    ? searchParams.propiedad.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : t("defaultProperty");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(10,10,10,0.55), rgba(10,10,10,0.75)), url('/images/property-default.jpg')",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative z-10 text-center px-8 max-w-xl">
        <p className="font-serif text-luxe-gold text-sm tracking-luxe uppercase animate-fade-in">
          Luxe Living
        </p>
        <h1
          className="mt-6 font-serif text-4xl md:text-5xl lg:text-6xl text-luxe-bone leading-tight animate-slide-up"
          style={{ animationDelay: "120ms" }}
        >
          {t("welcomeTo")}
          <br />
          <span className="text-luxe-gold-soft italic">{propertyName}</span>
        </h1>
        <p
          className="mt-6 text-luxe-bone/80 text-sm md:text-base animate-slide-up"
          style={{ animationDelay: "260ms" }}
        >
          {t("tagline")}
        </p>
        <div className="mt-12 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <Link
            href="/propiedades"
            className="inline-block border border-luxe-gold text-luxe-bone hover:bg-luxe-gold hover:text-luxe-black transition-colors duration-200 ease-luxe px-8 py-4 text-xs tracking-luxe uppercase"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
