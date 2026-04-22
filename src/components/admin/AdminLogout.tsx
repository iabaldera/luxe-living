"use client";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();
  const supabase = createClient();
  return (
    <button
      onClick={async () => { await supabase.auth.signOut(); router.push("/admin/login"); router.refresh(); }}
      className="mt-3 text-[11px] tracking-luxe uppercase text-luxe-bone/80 hover:text-luxe-gold"
    >
      Cerrar sesión
    </button>
  );
}
