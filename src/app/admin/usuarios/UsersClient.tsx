"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export interface AdminUser {
  id: string;
  email: string | undefined;
  created_at?: string;
  last_sign_in_at?: string | null;
  email_confirmed_at?: string | null;
  user_metadata?: { nombre?: string; telefono?: string; avatar_url?: string; role?: string };
}

const BUCKET = "luxe-media";

export default function UsersClient({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">Panel</p>
          <h1 className="mt-1 font-serif text-3xl text-luxe-black">Usuarios</h1>
          <p className="mt-1 text-sm text-luxe-muted">{users.length} usuario(s) registrados</p>
        </div>
        <button onClick={() => setCreating(true)}
          className="px-4 py-2 bg-luxe-black text-luxe-bone text-[11px] tracking-luxe uppercase rounded-sm hover:bg-luxe-gold hover:text-luxe-black transition-colors">
          + Nuevo usuario
        </button>
      </div>

      <div className="mt-8 bg-white border border-luxe-line rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-luxe-bone text-[10px] tracking-luxe uppercase text-luxe-muted">
            <tr>
              <th className="text-left px-4 py-3">Perfil</th>
              <th className="text-left px-4 py-3">Correo</th>
              <th className="text-left px-4 py-3">Teléfono</th>
              <th className="text-left px-4 py-3">Rol</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const m = u.user_metadata || {};
              const nombre = m.nombre || "—";
              return (
                <tr key={u.id} className="border-t border-luxe-line">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {m.avatar_url ? (
                        <img src={m.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-luxe-line" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-luxe-cream border border-luxe-line flex items-center justify-center text-[11px] text-luxe-muted">
                          {(nombre || u.email || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-luxe-black">{nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-luxe-muted">{u.email}</td>
                  <td className="px-4 py-3 text-luxe-muted">{m.telefono || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-luxe uppercase px-2 py-1 rounded-full border ${
                      m.role === "admin" ? "border-luxe-gold/60 bg-luxe-gold/20 text-luxe-black" : "border-luxe-line text-luxe-muted"
                    }`}>{m.role || "user"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-luxe uppercase px-2 py-1 rounded-full border ${
                      u.email_confirmed_at ? "border-luxe-gold/50 bg-luxe-gold/10 text-luxe-black" : "border-luxe-line text-luxe-muted"
                    }`}>{u.email_confirmed_at ? "Confirmado" : "Pendiente"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(u)}
                      className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep border-b border-luxe-gold/50 hover:text-luxe-black">
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-luxe-muted text-sm">No hay usuarios todavía.</td></tr>}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <UserEditor
          user={editing}
          onClose={() => { setEditing(null); setCreating(false); router.refresh(); }}
        />
      )}
    </>
  );
}

function UserEditor({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  const supabase = createClient();
  const isNew = !user;
  const m = user?.user_metadata || {};
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState(m.nombre ?? "");
  const [telefono, setTelefono] = useState(m.telefono ?? "");
  const [avatar, setAvatar] = useState(m.avatar_url ?? "");
  const [role, setRole] = useState(m.role ?? "user");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function uploadAvatar(file: File) {
    setBusy(true); setErr(null);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `avatars/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600" });
    if (error) { setErr(error.message); setBusy(false); return; }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setAvatar(data.publicUrl);
    setBusy(false);
  }

  async function save() {
    setBusy(true); setErr(null);
    const body: any = { nombre, telefono, avatar_url: avatar, role };
    if (email) body.email = email;
    if (password) body.password = password;
    const url = "/api/admin/users";
    const opts = isNew
      ? { method: "POST", body: JSON.stringify({ ...body, email, password: password || "changeme123" }) }
      : { method: "PATCH", body: JSON.stringify({ id: user!.id, ...body }) };
    const res = await fetch(url, { ...opts, headers: { "Content-Type": "application/json" } });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(data.error ?? "Error guardando."); return; }
    window.location.reload();
  }

  async function remove() {
    if (!user) return;
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
    setBusy(true); setErr(null);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(data.error ?? "Error eliminando."); return; }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-luxe-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-scale-in">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-luxe uppercase text-luxe-gold-deep">{isNew ? "Nuevo" : "Editar"}</p>
            <h2 className="mt-1 font-serif text-2xl text-luxe-black">{isNew ? "Crear usuario" : nombre || email}</h2>
          </div>
          <button onClick={onClose} className="text-luxe-muted hover:text-luxe-black text-2xl leading-none">×</button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            {avatar ? (
              <img src={avatar} alt="" className="w-20 h-20 rounded-full object-cover border border-luxe-line" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-luxe-cream border border-luxe-line flex items-center justify-center text-2xl font-serif text-luxe-muted">
                {(nombre || email || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <label className="flex-1">
              <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Foto de perfil</span>
              <input type="file" accept="image/*" disabled={busy}
                onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
                className="mt-1 block w-full text-xs text-luxe-muted file:mr-2 file:py-1.5 file:px-3 file:border file:border-luxe-line file:bg-luxe-bone file:text-luxe-black file:text-[11px] file:tracking-luxe file:uppercase file:rounded-sm hover:file:border-luxe-gold" />
              {avatar && <button type="button" onClick={() => setAvatar("")} className="mt-1 text-[10px] text-luxe-muted hover:text-red-600">Quitar foto</button>}
            </label>
          </div>

          <Field label="Nombre" value={nombre} onChange={setNombre} />
          <Field label="Correo" value={email} onChange={setEmail} type="email" />
          <Field label="Teléfono" value={telefono} onChange={setTelefono} placeholder="+1 809 000 0000" />
          <Field label={isNew ? "Contraseña" : "Nueva contraseña (opcional)"} value={password} onChange={setPassword} type="password" />
          <label className="block">
            <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">Rol</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="mt-1.5 w-full bg-white border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold">
              <option value="user">Huésped</option>
              <option value="cohost">Co-host</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Administrador</option>
            </select>
          </label>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <div className="flex items-center gap-2 pt-4 border-t border-luxe-line">
            <button onClick={save} disabled={busy}
              className="flex-1 py-2.5 bg-luxe-black text-luxe-bone text-xs tracking-luxe uppercase rounded-sm hover:bg-luxe-gold hover:text-luxe-black transition-colors disabled:opacity-50">
              {busy ? "Guardando…" : "Guardar"}
            </button>
            {!isNew && (
              <button onClick={remove} disabled={busy}
                className="px-4 py-2.5 border border-red-500/40 text-red-600 text-xs tracking-luxe uppercase rounded-sm hover:bg-red-50 disabled:opacity-50">
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-luxe uppercase text-luxe-muted">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-white border border-luxe-line rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-luxe-gold" />
    </label>
  );
}
