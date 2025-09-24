export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { exportAll } from "@/lib/db";
// Jeśli masz ochronę admina, odkomentuj i dopasuj:
// import { requireAdmin } from "@/lib/auth";

export async function GET() {
  // await requireAdmin();
  const json = await exportAll();
  return new NextResponse(JSON.stringify(json, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="rafbakki-products-${Date.now()}.json"`,
    },
  });
}
