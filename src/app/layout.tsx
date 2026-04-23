import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import Shell from "@/components/Shell";
import Toaster from "@/components/Toaster";
import { getContact } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const c = await getContact();
    const icon = c.favicon || c.logo || "/icon.svg";
    return {
      title: `${c.brand || "Luxe Living"} — Guest Portal`,
      description: "Una experiencia íntima en Santiago de los Caballeros.",
      manifest: "/manifest.webmanifest",
      icons: { icon },
    };
  } catch {
    return {
      title: "Luxe Living — Guest Portal",
      description: "Una experiencia íntima en Santiago de los Caballeros.",
      manifest: "/manifest.webmanifest",
      icons: { icon: "/icon.svg" },
    };
  }
}

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  let logo: string | null = null;
  let brand: string | undefined;
  try {
    const c = await getContact();
    logo = c.logo ?? null;
    brand = c.brand;
  } catch {}

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Shell logoUrl={logo} brand={brand}>{children}</Shell>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
