import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const input = (form.get("password") ?? "").toString();
  const target = process.env.ADMIN_PASSWORD || "";
  const base = new URL(req.url);

  // log do Functions Logs (Vercel → Deployments → View Functions Logs)
  console.log("DEBUG LOGIN", { targetSet: !!target, match: input === target });

  if (!target || input !== target) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", base), { status: 302 });
  }

  const res = NextResponse.redirect(new URL("/admin", base), { status: 302 });

  // na produkcji cookie 'secure', w dev nie
  const isProd = process.env.VERCEL_ENV === "production";
  res.cookies.set("admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProd,
    // maxAge: 60 * 60 * 8, // opcjonalnie 8h
  });
  return res;
}
