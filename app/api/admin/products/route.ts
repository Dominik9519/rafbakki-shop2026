import { NextResponse } from "next/server";
import { clearAllProducts, saveProduct, type Product, listProducts } from "@/lib/db";
// import { requireAdmin } from "@/lib/auth";

export async function GET() {
  // await requireAdmin();
  const items = await listProducts();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: Request) {
  // await requireAdmin();
  const body = await req.json();

  // prosta walidacja
  const p: Product = {
    id: String(body.id || "").trim(),
    name: String(body.name || "").trim(),
    price: Number(body.price || 0),
    imageUrl: body.imageUrl ? String(body.imageUrl).trim() : undefined,
    description: body.description ? String(body.description).trim() : undefined,
    category: body.category ? String(body.category).trim() : undefined,
  };

  if (!p.id || !p.name || !Number.isFinite(p.price)) {
    return NextResponse.json({ ok: false, error: "Wymagane: id, name, price" }, { status: 400 });
  }

  await saveProduct(p);
  return NextResponse.json({ ok: true, product: p });
}

export async function DELETE() {
  // await requireAdmin();
  await clearAllProducts();
  return NextResponse.json({ ok: true });
}
