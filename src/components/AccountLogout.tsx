"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function AccountLogout() {
  const router = useRouter();
  const supabase = createClient();
  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button onClick={logout}
      className="text-[11px] tracking-luxe uppercase text-luxe-muted hover:text-luxe-black border border-luxe-line hover:border-luxe-black px-3 py-2 rounded-sm transition-colors">
      Cerrar sesión
    </button>
  );
}
