import { createClient } from "@/lib/supabase/server";
import type { ContactSettings, PropertyRow, PlaceRow, RuleRow } from "@/lib/supabase/types";

export async function getProperties(): Promise<PropertyRow[]> {
  const supabase = createClient();
  const { data } = await supabase.from("properties").select("*").eq("activo", true).order("created_at", { ascending: false });
  return (data ?? []) as PropertyRow[];
}

export async function getProperty(slug: string): Promise<PropertyRow | null> {
  const supabase = createClient();
  const { data } = await supabase.from("properties").select("*").eq("slug", slug).eq("activo", true).maybeSingle();
  return (data as PropertyRow | null) ?? null;
}

export async function getPlaces(): Promise<PlaceRow[]> {
  const supabase = createClient();
  const { data } = await supabase.from("places").select("*").eq("activo", true).order("nombre");
  return (data ?? []) as PlaceRow[];
}

export async function getRules(): Promise<RuleRow[]> {
  const supabase = createClient();
  const { data } = await supabase.from("rules").select("*").eq("activo", true).order("orden");
  return (data ?? []) as RuleRow[];
}

export async function getContact(): Promise<ContactSettings> {
  const supabase = createClient();
  const { data } = await supabase.from("settings").select("value").eq("key", "contact").maybeSingle();
  return (data?.value ?? {
    whatsapp: "", telegram: "", email: "", brand: "Luxe Living",
  }) as ContactSettings;
}
