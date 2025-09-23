// app/api/admin/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const input = (form.get("password") ?? "").toString();
  const target = process.env.ADMIN_PASSWORD || "";
  const urlBase = new URL(req.url);

  // debug do logów Vercel (Deployments → View Functions Logs)
  console.log("DEBUG LOGIN", { targetSet: !!target, match: input === target });

  if (!target || input !== target) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", urlBase), { status: 302 });
  }

  const res = NextResponse.redirect(new URL("/admin", urlBase), { status: 302 });
  res.cookies.set("admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.VERCEL_ENV === "production", // prod: true, lokalnie: false
    // maxAge: 60 * 60 * 8, // opcjonalnie 8h
  });
  return res;
}
