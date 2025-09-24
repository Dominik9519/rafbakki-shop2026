// app/api/admin/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const input = (form.get("password") ?? "").toString();
  const target = process.env.ADMIN_PASSWORD || "";
  const base = new URL(req.url);

  if (!target || input !== target) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", base), { status: 302 });
  }

  // Przekierowanie na /admin z dodanym timestampem (żeby ominąć cache)
  const res = NextResponse.redirect(new URL("/admin?t=" + Date.now(), base), { status: 302 });

  // Ustawienie ciasteczka admin=1
  res.cookies.set("admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.VERCEL_ENV === "production", // w dev jest false
    // maxAge: 60 * 60 * 8, // opcjonalnie – 8h ważności sesji
  });

  return res;
}
