# Setup Supabase — Luxe Living

## 1. Crea el proyecto
- Entra a https://supabase.com → **New project**
- Región recomendada: `us-east-1` (cercana a RD)
- Guarda la contraseña de DB (la pedirá una vez)

## 2. Corre el esquema
- Abre el **SQL Editor** del proyecto
- Copia y ejecuta todo el archivo [`supabase/schema.sql`](supabase/schema.sql)
- Deberías ver tablas: `properties`, `places`, `rules`, `settings`

## 3. Crea el bucket de storage
- Sidebar → **Storage** → **New bucket**
- Nombre: `luxe-media`
- **Public bucket**: ✅ activado
- En **Policies** del bucket añade:
  - `SELECT` for `public` → `true` (lectura pública)
  - `INSERT / UPDATE / DELETE` for `authenticated` → `true` (solo admins)

## 4. Crea el usuario admin
- Sidebar → **Authentication** → **Users** → **Add user (email/password)**
- Usa tu correo real y una contraseña fuerte
- Marca "Auto-confirm user"

## 5. Copia las credenciales a `.env.local`
Sidebar → **Project Settings** → **API**

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # opcional, no se usa aún
```

Reinicia el dev server después de editar `.env.local`.

## 6. Entra al dashboard
- http://localhost:3000/admin/login
- Ingresa con el usuario que creaste en el paso 4
- Desde ahí: añade propiedades, lugares, reglas y ajusta el contacto.

## Rutas del dashboard
- `/admin` — resumen con contadores
- `/admin/propiedades` — CRUD con picker de ubicación y subida de fotos
- `/admin/lugares` — CRUD con pin arrastrable en el mapa
- `/admin/reglas` — editor inline de reglas
- `/admin/configuracion` — canales de contacto (WhatsApp, Telegram, correo)

Las páginas públicas (`/propiedades`, `/mapa`, `/reglas`) leen desde Supabase en cada request.
