import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Chronimy /admin (poza stroną logowania) i /api/admin (poza endpointem logowania)
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi  = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (isAdminPage || isAdminApi) {
    // ⬇️ nazwa cookie musi się zgadzać z tą ustawianą w /api/admin/login (u nas: "admin")
    const cookie = req.cookies.get("admin")?.value;

    if (cookie !== "1") {
      if (isAdminApi) {
        // dla API lepiej zwrócić 401 JSON zamiast redirectu
        return new NextResponse(JSON.stringify({ ok: false, error: "UNAUTHORIZED" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      // dopnij parametr, żeby omijać ewentualny cache
      url.searchParams.set("e", "mw");
      url.searchParams.set("t", Date.now().toString());
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Matcher obejmuje całe /admin i /api/admin,
// ale dzięki warunkom powyżej PRZEPUŚCI /admin/login oraz /api/admin/login
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
