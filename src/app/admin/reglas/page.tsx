import { createClient } from "@/lib/supabase/server";
import RulesEditor from "@/components/admin/RulesEditor";
import type { RuleRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function RulesAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("rules").select("*").order("orden");
  return (
    <div>
      <h1 className="font-serif text-4xl text-luxe-black">Reglas del condominio</h1>
      <p className="text-luxe-muted mt-1 text-sm">Se muestran en la página pública /reglas.</p>
      <div className="mt-8">
        <RulesEditor initial={(data ?? []) as RuleRow[]} />
      </div>
    </div>
  );
}
