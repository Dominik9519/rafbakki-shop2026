import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

// prosty parser ciasteczek z nagłówka (fallback)
function getFromHeaderCookie(header: string | null): string | null {
  if (!header) return null;
  const parts = header.split(";").map(s => s.trim());
  for (const p of parts) {
    if (p.startsWith("admin=")) return p.split("=", 2)[1] || null;
  }
  return null;
}

export async function requireAdmin() {
  // 1) standardowo z API Next
  const fromAPI = cookies().get("admin")?.value ?? null;
  // 2) fallback z nagłówka
  const fromHeader = getFromHeaderCookie(headers().get("cookie"));
  const val = fromAPI ?? fromHeader;

  // Dodatkowy bezpiecznik: akceptuj "1" i 1
  if (val !== "1") {
    // dopnij query, żeby mieć pewność, że nie wchodzisz w cache
    redirect(`/admin/login?e=nocookie&t=${Date.now()}`);
  }
}

export async function logoutServer() {
  "use server";
  cookies().set("admin", "", { path: "/", maxAge: 0 });
  redirect("/admin/login");
}
