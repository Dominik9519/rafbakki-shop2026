import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function requireAdmin() {
  if (cookies().get("admin")?.value !== "1") redirect("/admin/login");
}
