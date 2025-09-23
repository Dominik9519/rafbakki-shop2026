import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const ok = cookies().get("admin")?.value === "1";
  if (!ok) redirect("/admin/login");
}
