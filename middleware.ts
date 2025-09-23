import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const isAdminArea = url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/login");
  const isAdminApi  = url.pathname.startsWith("/api/admin");
  if (isAdminArea || isAdminApi) {
    const cookie = req.cookies.get("rafbakki_admin")?.value;
    if (cookie !== "1") return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
