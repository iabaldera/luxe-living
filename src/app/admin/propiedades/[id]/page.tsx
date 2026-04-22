import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PropertyEditor from "@/components/admin/PropertyEditor";
import type { PropertyRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditProperty({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("properties").select("*").eq("id", params.id).maybeSingle();
  if (!data) return notFound();
  return <PropertyEditor initial={data as PropertyRow} />;
}
