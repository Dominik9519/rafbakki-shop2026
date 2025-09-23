import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const input = (form.get("password") ?? "").toString();
  const target = process.env.ADMIN_PASSWORD || "";
  console.log("DEBUG LOGIN", { input, targetSet: !!target, match: input === target });

  const urlBase = new URL(req.url);

  if (!target || input !== target) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", urlBase), { status: 302 });
  }

  const res = NextResponse.redirect(new URL("/admin", urlBase), { status: 302 });
  res.cookies.set("admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // secure: true, // jeśli HTTPS tylko na prod, lokalnie zostaw false
  });
  return res;
}
