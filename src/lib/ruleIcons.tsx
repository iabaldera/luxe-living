import type { FC, SVGProps } from "react";

type Icon = FC<SVGProps<SVGSVGElement>>;

const base = "stroke-current";

export const RULE_ICONS: Record<string, Icon> = {
  silencio: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className={base} {...p}>
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
  llaves: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <circle cx="8" cy="14" r="4" /><path d="M11 12l9-9M17 6l3 3M14 9l3 3" />
    </svg>
  ),
  wifi: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M5 12a10 10 0 0 1 14 0M8 15a6 6 0 0 1 8 0" /><circle cx="12" cy="18" r="1" />
    </svg>
  ),
  basura: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
    </svg>
  ),
  piscina: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M2 18c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1M8 14V6a2 2 0 0 1 4 0v8M12 10h4M16 14V6a2 2 0 0 0-4 0" />
    </svg>
  ),
  gym: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M3 9v6M7 6v12M17 6v12M21 9v6M7 12h10" />
    </svg>
  ),
  parking: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" /><path d="M10 17V8h3a2.5 2.5 0 0 1 0 5h-3" />
    </svg>
  ),
  fiesta: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M3 21l5-14 8 8-13 6zM15 3l2 2M19 4l2 2M18 9l2 2M12 3l1 2" />
    </svg>
  ),
  aire: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M3 8h12a3 3 0 1 0 0-6M3 12h16a3 3 0 1 1 0 6M3 16h10" />
    </svg>
  ),
  seguridad: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    </svg>
  ),
  info: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" />
    </svg>
  ),
  alerta: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M12 3l10 17H2L12 3zM12 10v4M12 17v.01" />
    </svg>
  ),
  corazon: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />
    </svg>
  ),
};

export const RULE_ICON_KEYS = Object.keys(RULE_ICONS);
