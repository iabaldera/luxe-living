"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function SaveButton({ propertyId, className = "" }: { propertyId: string; className?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!alive) return;
      if (!user) { setReady(true); return; }
      const { data } = await supabase.from("saved_properties")
        .select("property_id").eq("property_id", propertyId).eq("user_id", user.id).maybeSingle();
      if (!alive) return;
      setSaved(!!data); setReady(true);
    })();
    return () => { alive = false; };
  }, [propertyId, supabase]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/cuenta/login?next=${encodeURIComponent(window.location.pathname)}`);
      setBusy(false);
      return;
    }
    if (saved) {
      await supabase.from("saved_properties").delete().eq("user_id", user.id).eq("property_id", propertyId);
      setSaved(false);
    } else {
      await supabase.from("saved_properties").insert({ user_id: user.id, property_id: propertyId });
      setSaved(true);
    }
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Quitar de guardados" : "Guardar"}
      disabled={!ready || busy}
      className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur border border-luxe-line hover:border-luxe-gold flex items-center justify-center transition-all ${saved ? "text-luxe-gold-deep" : "text-luxe-muted hover:text-luxe-gold-deep"} ${className}`}
    >
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-7-4.5-9.5-9.2C1 8.6 3 5 6.5 5c2 0 3.7 1.2 4.5 2.8.8-1.6 2.5-2.8 4.5-2.8 3.5 0 5.5 3.6 4 6.8C19 16.5 12 21 12 21z" />
      </svg>
    </button>
  );
}
