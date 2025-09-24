export const dynamic = "force-dynamic";
export const revalidate = 0;

import { listProducts, listCategories } from "@/lib/db";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function Page({ searchParams }: { searchParams?: { cat?: string } }) {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const activeSlug = (searchParams?.cat || "").toLowerCase();

  const filtered = activeSlug
    ? products.filter(p => p.category && slugify(p.category) === activeSlug)
    : products;

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* Pigułki kategorii */}
      {categories.length > 0 && (
        <div className="pills">
          <Link href="/" className={`pill ${!activeSlug ? "pill-active" : ""}`}>Allar vörur</Link>
          {categories.map(cat => {
            const slug = slugify(cat);
            return (
              <Link key={cat} href={`/?cat=${slug}`} className={`pill ${activeSlug === slug ? "pill-active" : ""}`}>
                {cat}
              </Link>
            );
          })}
        </div>
      )}

      {/* Grid produktów */}
      {filtered.length === 0 ? (
        <div className="text-dim">Engar vörur í þessari flokk.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p: any) => {
            const isPng = p.imageUrl?.toLowerCase().endsWith(".png");
            return (
              <div key={p.id} className="card flex flex-col">
                <Link href={`/product/${p.id}`}>
                  {p.imageUrl && (
                    <div
                      className={`w-full rounded-2xl overflow-hidden flex items-center justify-center ${
                        isPng ? "bg-white" : "bg-white/5"
                      } h-[220px] group`}
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="mt-3 text-lg font-semibold">{p.name}</div>
                  <div className="text-dim">{p.price} ISK</div>
                  {p.category && (
                    <div className="mt-1 text-xs text-dim">Flokkur: {p.category}</div>
                  )}
                </Link>

                <div className="mt-auto pt-3">
                  <AddToCartButton
                    product={{ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
