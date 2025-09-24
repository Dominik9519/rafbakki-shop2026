export const dynamic = "force-dynamic"; // <— wyłącz SSG na tym route
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { replaceAllProducts, type Product } from "@/lib/db";
// import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  // await requireAdmin();
  const body = await req.json();
  const items = (body?.items ?? []) as Product[];
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ ok: false, error: "Brak 'items' w payloadzie" }, { status: 400 });
  }
  await replaceAllProducts(items);
  return NextResponse.json({ ok: true, count: items.length });
}
