"use client";

import { useLocale } from "next-intl";
import type { ContactSettings } from "@/lib/supabase/types";

export default function ContactAssistant({ contact }: { contact: ContactSettings }) {
  const locale = useLocale();
  if (!contact.whatsapp) return null;

  const name = contact.assistantName || contact.brand || "Concierge";
  const role = (locale === "en" ? contact.assistantRole_en : contact.assistantRole) || (locale === "en" ? "Reservations Assistant" : "Asistente de Reservas");
  const greeting = (locale === "en" ? contact.assistantGreeting_en : contact.assistantGreeting)
    || (locale === "en"
      ? `Hi! I'm ${name}. Happy to help you pick the perfect stay — ask me anything about availability, pricing or amenities.`
      : `¡Hola! Soy ${name}. Con gusto te ayudo a elegir la estancia ideal — pregúntame por disponibilidad, precios o amenidades.`);

  const defaultMsg = locale === "en"
    ? `Hello ${name}, I'm interested in one of your properties and would like more information.`
    : `Hola ${name}, estoy interesado(a) en una de sus propiedades y me gustaría recibir más información.`;

  const waHref = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(defaultMsg)}`;
  const labels = {
    badge: locale === "en" ? "Available now" : "Disponible ahora",
    chat: locale === "en" ? "Chat on WhatsApp" : "Chatear por WhatsApp",
    response: locale === "en" ? "Typical reply in a few minutes" : "Respuesta típica en pocos minutos",
  };

  return (
    <aside className="relative overflow-hidden bg-gradient-to-br from-luxe-black via-luxe-ink to-luxe-black text-luxe-bone border border-luxe-gold/30 rounded-sm p-6 md:p-8 shadow-gold">
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-luxe-gold/10 blur-3xl" aria-hidden />
      <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="relative flex-shrink-0">
          {contact.assistantPhoto ? (
            <img
              src={contact.assistantPhoto}
              alt={name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-luxe-gold/60"
            />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-luxe-gold/20 border-2 border-luxe-gold/60 flex items-center justify-center font-serif text-3xl text-luxe-gold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-luxe-black" aria-hidden />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[10px] tracking-luxe uppercase text-luxe-gold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {labels.badge}
          </div>
          <h3 className="mt-1 font-serif text-2xl md:text-3xl text-luxe-bone">{name}</h3>
          <p className="text-xs tracking-luxe uppercase text-luxe-gold-deep">{role}</p>
          <p className="mt-3 text-sm text-luxe-bone/80 leading-relaxed max-w-xl">{greeting}</p>
        </div>

        <div className="flex-shrink-0 w-full md:w-auto">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 px-6 py-3.5 bg-[#25D366] text-white rounded-sm hover:bg-[#1ebe57] transition-all duration-200 hover:shadow-gold w-full md:w-auto"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
              <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5 0 1.5 1.1 2.9 1.2 3.1.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.3-.7.3-1.2.2-1.4-.1-.1-.3-.2-.6-.3z M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.8 3.3 1.3 5.2 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3.4 1 .9-3.3-.2-.4C3.4 15.2 3 13.6 3 12c0-4.9 4.1-9 9-9s9 4.1 9 9-4 9.3-9 9.3z"/>
            </svg>
            <div className="flex flex-col items-start">
              <span className="text-[11px] tracking-luxe uppercase opacity-90">{labels.chat}</span>
              <span className="text-[10px] opacity-75">{labels.response}</span>
            </div>
          </a>
        </div>
      </div>
    </aside>
  );
}
