import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(all) { all.forEach(({ name, value, options }) => res.cookies.set(name, value, options)); },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;
  const isAdmin = path.startsWith("/admin");
  const isAdminLogin = path === "/admin/login";
  const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
  const derivedAdminEmail = (process.env.ADMIN_EMAIL ?? `${ADMIN_USER.toLowerCase()}@luxeliving.app`).toLowerCase();
  const extraEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const role = (user?.user_metadata as any)?.role;
  const email = user?.email?.toLowerCase();
  const isAdminUser = !!user && (
    role === "admin" ||
    email === derivedAdminEmail ||
    (email && extraEmails.includes(email))
  );

  if (isAdmin && !isAdminLogin && !isAdminUser) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (isAdminLogin && isAdminUser) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
