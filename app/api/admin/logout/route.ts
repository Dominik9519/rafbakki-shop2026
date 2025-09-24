import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const base = new URL(req.url);
  const res = NextResponse.redirect(new URL("/admin/login", base), { status: 302 });

  // usunięcie cookie (ustawiamy maxAge=0)
  res.cookies.set("admin", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: process.env.VERCEL_ENV === "production",
  });

  return res;
}
