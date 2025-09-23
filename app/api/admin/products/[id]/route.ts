import { NextResponse } from "next/server";
import { deleteProduct, saveProduct, getProduct, type Product } from "@/lib/db";
// import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // await requireAdmin();
  const id = decodeURIComponent(params.id);
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // await requireAdmin();
  const id = decodeURIComponent(params.id);
  const exists = await getProduct(id);
  if (!exists) {
    return NextResponse.json({ ok: false, error: "Produkt nie istnieje" }, { status: 404 });
  }
  const body = await req.json();
  const p: Product = {
    id,
    name: String(body.name ?? exists.name),
    price: Number(body.price ?? exists.price),
    imageUrl: body.imageUrl !== undefined ? String(body.imageUrl) : exists.imageUrl,
    description: body.description !== undefined ? String(body.description) : exists.description,
    category: body.category !== undefined ? String(body.category) : exists.category,
  };
  await saveProduct(p);
  return NextResponse.json({ ok: true, product: p });
}
