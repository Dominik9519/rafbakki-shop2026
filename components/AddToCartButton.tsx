"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function AddToCartButton({
  product,
}: {
  product: { id: string; name: string; price: number; imageUrl?: string };
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [ok, setOk] = useState(false);

  function handleAdd() {
    const q = Number(qty) || 1;
    if (q < 1) return;
    addItem({ id: product.id, name: product.name, price: product.price, qty: q, imageUrl: product.imageUrl });
    setOk(true);
    setTimeout(() => setOk(false), 1200);
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        value={qty}
        min={1}
        onChange={(e) => setQty(Number(e.target.value))}
        className="input w-16 !h-10 !py-0 text-center leading-none"
      />
      <button className="btn !h-10 !py-0 px-5" onClick={handleAdd}>
        Bæta í körfu
      </button>
      {ok && <span className="text-xs text-green-400 ml-1">✓</span>}
    </div>
  );
}
