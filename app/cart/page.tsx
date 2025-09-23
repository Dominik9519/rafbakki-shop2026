"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import type { CartItem } from "@/app/context/CartContext";
import Link from "next/link";

type OrderForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};

export default function CartPage() {
  const { items, updateQty, removeItem, clear } = useCart();
  const [form, setForm] = useState<OrderForm>({ name: "", email: "", phone: "", address: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const total: number = items.reduce((sum: number, i: CartItem) => sum + i.price * i.qty, 0);

  async function submitOrder() {
  if (items.length === 0) return;
  setLoading(true);
  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          unitPrice: i.price,
          qty: i.qty,
        })),
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        notes: form.notes || undefined,
      }),
    });
    const data = await res.json();
    if (data.ok) {
      setOrderId(data.orderId);
      clear();
    } else {
      alert("Błąd przy składaniu zamówienia: " + (data.error ?? "nieznany"));
    }
  } catch (err: any) {
    alert("Błąd sieci: " + err?.message);
  } finally {
    setLoading(false);
  }
}


  if (orderId) {
    return (
      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Takk fyrir!</h1>
        <p>Númer pöntunar: <b>{orderId}</b></p>
        <Link href="/" className="btn-ghost w-fit">Til baka</Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Karfa</h1>
        <Link href="/" className="btn-ghost">Til baka</Link>
      </div>

      {items.length === 0 && <p className="text-center text-dim">Karfan er tóm.</p>}

      {items.length > 0 && (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Lista */}
          <div className="lg:col-span-3 card">
            <ul className="divide-y divide-white/10">
              {items.map((item: CartItem) => (
                <li key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{item.name}</div>
                    <div className="text-dim text-sm">{item.price} ISK</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.qty}
                      min={1}
                      className="w-16 input"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQty(item.id, Number(e.target.value))}
                    />
                    <button className="btn-ghost" onClick={() => removeItem(item.id)}>Fjarlægja</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right font-semibold">Samtals: {total} ISK</div>
            <div className="mt-3">
              <button className="btn-ghost" onClick={clear}>Tæma körfu</button>
            </div>
          </div>

          {/* Formularz */}
          <div className="lg:col-span-2 card">
            <div className="text-lg font-semibold mb-3">Pöntunarupplýsingar</div>
            <div className="space-y-2">
              <input className="input" placeholder="Nafn" value={form.name}
                     onChange={(e) => setForm({ ...form, name: e.target.value })}/>
              <input className="input" placeholder="Netfang" value={form.email}
                     onChange={(e) => setForm({ ...form, email: e.target.value })}/>
              <input className="input" placeholder="Sími" value={form.phone}
                     onChange={(e) => setForm({ ...form, phone: e.target.value })}/>
              <input className="input" placeholder="Heimilisfang (valfrjálst)" value={form.address}
                     onChange={(e) => setForm({ ...form, address: e.target.value })}/>
              <textarea className="input" placeholder="Athugasemdir (valfrjálst)" value={form.notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, notes: e.target.value })}/>
            </div>
            <button className="btn w-full mt-4" onClick={submitOrder} disabled={loading}>
              {loading ? "Senda..." : "Panta"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
