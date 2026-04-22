import { createClient } from "@/lib/supabase/server";
import ContactEditor from "@/components/admin/ContactEditor";
import type { ContactSettings } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const supabase = createClient();
  const { data } = await supabase.from("settings").select("value").eq("key", "contact").maybeSingle();
  const contact = (data?.value ?? {
    whatsapp: "", telegram: "", email: "", brand: "Luxe Living",
  }) as ContactSettings;
  return (
    <div>
      <h1 className="font-serif text-4xl text-luxe-black">Configuración</h1>
      <p className="text-luxe-muted mt-1 text-sm">Canales de contacto usados por el formulario de reservas.</p>
      <div className="mt-8 max-w-2xl">
        <ContactEditor initial={contact} />
      </div>
    </div>
  );
}
