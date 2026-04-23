"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Toast = { id: number; kind: "success" | "error" | "info"; msg: string };
type Ctx = { push: (t: Omit<Toast, "id">) => void };
const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  return ctx ?? { push: (t: Omit<Toast, "id">) => { try { window.dispatchEvent(new CustomEvent("luxe-toast", { detail: t })); } catch {} } };
}

export default function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setItems((arr) => [...arr, { id, ...t }]);
    setTimeout(() => setItems((arr) => arr.filter((x) => x.id !== id)), 3500);
  }, []);

  useEffect(() => {
    const onEvt = (e: Event) => { const d = (e as CustomEvent).detail; if (d?.msg) push(d); };
    window.addEventListener("luxe-toast", onEvt as EventListener);
    return () => window.removeEventListener("luxe-toast", onEvt as EventListener);
  }, [push]);

  return (
    <ToastCtx.Provider value={{ push }}>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10050] flex flex-col gap-2 pointer-events-none">
        {items.map((t) => (
          <div key={t.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-sm shadow-xl border text-xs tracking-luxe uppercase animate-fade-in backdrop-blur ${
              t.kind === "success" ? "bg-luxe-black/95 text-luxe-bone border-luxe-gold/60" :
              t.kind === "error" ? "bg-red-600/95 text-white border-red-700" :
              "bg-luxe-bone/95 text-luxe-black border-luxe-line"
            }`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
