import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlaceEditor from "@/components/admin/PlaceEditor";
import type { PlaceRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditPlace({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("places").select("*").eq("id", params.id).maybeSingle();
  if (!data) return notFound();
  return <PlaceEditor initial={data as PlaceRow} />;
}
