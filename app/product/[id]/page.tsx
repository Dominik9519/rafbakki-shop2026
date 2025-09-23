import { getProduct } from "@/lib/db";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return <div className="p-6">Vara fannst ekki.</div>;

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-5">
      <Link href="/" className="btn-ghost w-fit">Til baka</Link>

      {/* Karta z dwukolumnową siatką na desktopie */}
      <div className="card grid lg:grid-cols-2 gap-6 items-start">
        {/* LEWA: mniejsze zdjęcie, z białym tłem */}
<div className="w-full">
  {product.imageUrl && (
    <div className="w-full rounded-xl bg-white p-4 flex items-center justify-center">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-auto max-h-[420px] object-contain"
      />
    </div>
  )}
</div>


        {/* PRAWA: tytuł, cena, opis, przycisk */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="text-xl font-semibold">{product.price} ISK</div>
          {product.description && <p className="text-dim leading-relaxed">{product.description}</p>}

          <AddToCartButton product={product} />

          {/* ewentualnie dodatkowe info/specyfikacja */}
          {/* <div className="text-sm text-dim">Afhending: 2–4 dagar</div> */}
        </div>
      </div>
    </main>
  );
}
