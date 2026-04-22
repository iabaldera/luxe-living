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

  const message = useMemo(
    () =>
      t("messageTemplate", {
        brand: CONTACT.brand,
        property: nombre,
        checkin: checkin || "—",
        checkout: checkout || "—",
        guests: String(guests),
        name: name || "—",
        notes: notes || "",
      }),
    [t, nombre, checkin, checkout, guests, name, notes]
  );

  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encoded}`;
  const telegramUrl = `https://t.me/${CONTACT.telegram}?text=${encoded}`;
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
          href={canSend ? telegramUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!canSend}
          className={`${channelBtn} ${
            canSend
              ? "border-luxe-gold text-luxe-black hover:bg-luxe-black hover:text-luxe-bone hover:border-luxe-black"
              : "border-luxe-line text-luxe-muted cursor-not-allowed pointer-events-none"
          }`}
        >
          <TelegramIcon /> {t("form.telegram")}
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
function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M9.7 15.3l-.4 3.8c.5 0 .8-.2 1-.5l2.5-2.3 5.1 3.7c.9.5 1.6.2 1.9-.9l3.3-15.4c.3-1.3-.5-1.9-1.4-1.5L1.3 9c-1.3.5-1.3 1.3-.2 1.6l5 1.6 11.6-7.3c.5-.3 1-.2.6.2" />
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
