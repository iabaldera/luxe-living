"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { PropertyRow, ContactSettings } from "@/lib/supabase/types";

export default function ReservationForm({ property, contact }: { property: PropertyRow; contact: ContactSettings }) {
  const CONTACT = contact;
  const t = useTranslations("properties");
  const locale = useLocale();
  const nombre = locale === "en" ? property.nombre_en : property.nombre;

  const [name, setName] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");

  const assistantName = CONTACT.assistantName || CONTACT.brand;
  const mapUrl =
    property.lat != null && property.lng != null
      ? `https://maps.google.com/?q=${property.lat},${property.lng}`
      : "";

  const message = useMemo(
    () =>
      t("messageTemplate", {
        assistant: assistantName,
        property: nombre,
        checkin: checkin || "—",
        checkout: checkout || "—",
        guests: String(guests),
        name: name || "—",
        notes: notes || "",
        mapUrl: mapUrl || "—",
      }),
    [t, assistantName, nombre, checkin, checkout, guests, name, notes, mapUrl]
  );

  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encoded}`;
  const emailSubject = encodeURIComponent(`${CONTACT.brand} · ${nombre}`);
  const emailUrl = `mailto:${CONTACT.email}?subject=${emailSubject}&body=${encoded}`;

  const canSend = name.trim() && checkin && checkout;

  const channelBtn =
    "flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 text-xs tracking-luxe uppercase border transition-all duration-200 ease-luxe";

  return (
    <div className="bg-white border border-luxe-line rounded-sm p-6 lg:p-8">
      <h2 className="font-serif text-2xl text-luxe-black">{t("form.title")}</h2>
      <p className="mt-1 text-sm text-luxe-muted">{t("form.subtitle")}</p>
      <div className="mt-5 h-px w-12 bg-luxe-gold" />

      <div className="mt-6 grid gap-4">
        <Field label={t("form.name")}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="luxe-input"
            placeholder="—"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t("form.checkin")}>
            <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} className="luxe-input" />
          </Field>
          <Field label={t("form.checkout")}>
            <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} className="luxe-input" />
          </Field>
        </div>

        <Field label={t("form.guests")}>
          <input
            type="number"
            min={1}
            max={property.huespedes}
            value={guests}
            onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
            className="luxe-input"
          />
        </Field>

        <Field label={t("form.notes")}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="luxe-input resize-none"
            placeholder="—"
          />
        </Field>
      </div>

      {(property.airbnb_url || property.booking_url) && (
        <>
          <p className="mt-6 text-[11px] tracking-luxe uppercase text-luxe-muted">{locale === "en" ? "Book directly" : "Reservar directamente"}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {property.airbnb_url && (
              <a
                href={property.airbnb_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${channelBtn} bg-[#FF385C] text-white border-[#FF385C] hover:bg-[#E11D48] hover:border-[#E11D48] transition-colors`}
              >
                <AirbnbIcon /> {locale === "en" ? "Rent on Airbnb" : "Rentar por Airbnb"}
              </a>
            )}
            {property.booking_url && (
              <a
                href={property.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${channelBtn} bg-[#003580] text-white border-[#003580] hover:bg-[#00224F] hover:border-[#00224F] transition-colors`}
              >
                <BookingIcon /> Booking.com
              </a>
            )}
          </div>
        </>
      )}

      <p className="mt-6 text-[11px] tracking-luxe uppercase text-luxe-muted">{t("form.sendVia")}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <a
          href={canSend ? whatsappUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!canSend}
          className={`${channelBtn} ${
            canSend
              ? "border-luxe-gold text-luxe-black hover:bg-luxe-black hover:text-luxe-bone hover:border-luxe-black"
              : "border-luxe-line text-luxe-muted cursor-not-allowed pointer-events-none"
          }`}
        >
          <WhatsIcon /> {t("form.whatsapp")}
        </a>
<a
          href={canSend ? emailUrl : undefined}
          aria-disabled={!canSend}
          className={`${channelBtn} ${
            canSend
              ? "border-luxe-gold text-luxe-black hover:bg-luxe-black hover:text-luxe-bone hover:border-luxe-black"
              : "border-luxe-line text-luxe-muted cursor-not-allowed pointer-events-none"
          }`}
        >
          <MailIcon /> {t("form.email")}
        </a>
      </div>

      <style jsx>{`
        .luxe-input {
          width: 100%;
          background: #f8f5f0;
          border: 1px solid #e6dfd1;
          border-radius: 2px;
          padding: 10px 12px;
          font-size: 14px;
          color: #0a0a0a;
          transition: border-color 150ms, background 150ms;
        }
        .luxe-input:focus {
          outline: none;
          border-color: #c9a96e;
          background: #ffffff;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function WhatsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M20 4A10 10 0 0 0 3.3 18l-1.3 4 4.1-1.3A10 10 0 1 0 20 4zm-8 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.4.8.8-2.3-.2-.3A8 8 0 1 1 12 22zm4.6-6c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.8-2c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3a3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7a9.5 9.5 0 0 0 4 3.5c2.3.8 2.3.5 2.7.5a2.5 2.5 0 0 0 1.7-1.2 2 2 0 0 0 .1-1.2c0-.2-.3-.2-.6-.3z" />
    </svg>
  );
}
function AirbnbIcon() {
  return (
    <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor">
      <path d="M16 1c-4 0-7 3.2-7 7.3 0 2 .7 3.7 1.9 6.2.3.6.7 1.3 1 2 .8 1.6 1.6 3.1 2 3.8l.2.3.1.1a2 2 0 0 0 3.5 0l.1-.1.2-.4c.5-.7 1.3-2.2 2-3.7l1.1-2c1.2-2.5 1.9-4.3 1.9-6.2C23 4.1 20 1 16 1zm0 2c2.9 0 5 2.3 5 5.3 0 1.4-.6 3-1.7 5.3l-1 2c-.7 1.3-1.4 2.7-1.9 3.4l-.2.3a.3.3 0 0 1-.4 0l-.1-.2c-.5-.8-1.2-2.2-2-3.5l-1-2C11.6 11.3 11 9.7 11 8.3 11 5.3 13.1 3 16 3z"/>
      <path d="M28.4 22.3c-.4-2.2-2-3.8-4.2-4.1-1.1-.2-2.1 0-3.5.4l-.6.2c-.5-.8-1-1.9-1.6-2.8-2 3.4-3.6 6-4.1 6.6-.8 1-2 1.6-3.4 1.6-2.3 0-4.2-1.8-4.2-4.1 0-.8.2-1.5.6-2.2.4-.7.8-1.1 1.6-1.8L10 14.5a53.6 53.6 0 0 0-1.6-3l-.6-.2c-1.4-.4-2.4-.6-3.5-.4-2.2.3-3.8 1.9-4.2 4-.2 1.2-.1 2.3.2 3.5.7 2.8 2.5 5.3 5.5 7.7 2 1.6 4 2.7 6.2 3.2a10 10 0 0 0 4.1 0c.6-.2 1.2-.4 1.9-.7 2.5 1.2 4.5 1.3 6.2.9 3-.8 5.2-3.3 5.9-6.1.3-1.3.4-2.4.2-3.6zm-22.2.4c-.9-2-1-4 0-5.5.6-1 1.5-1.7 2.6-1.9.8-.1 1.7.1 2.4.6.7.5 1.3 1.3 1.4 2.2.2 1.3-.5 2.7-1.9 3.5a3.7 3.7 0 0 1-4.5 1.1zm20 3c-.8 1.9-2.3 3.2-4.1 3.5a8 8 0 0 1-4.4-.7c.6-.3 1.2-.7 1.8-1.2 2.2-1.8 3.5-3.8 3.7-5.9 0-.8-.1-1.5-.4-2.1.8-.3 1.6-.5 2.3-.4 1.1.2 2 .9 2.6 1.9 1 1.5 1 3.5-.5 5z"/>
    </svg>
  );
}
function BookingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M4 3h10a5 5 0 0 1 3.2 8.8A5.5 5.5 0 0 1 14 21H4V3zm3 3v5h6a2.5 2.5 0 0 0 0-5H7zm0 8v4h7a2 2 0 0 0 0-4H7z"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 6l9 7 9-7" />
    </svg>
  );
}
