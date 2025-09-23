"use client";
import { useState } from "react";

export default function BuyForm({ product }: { product: { id: string; name: string; price: number } }) {
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });

  async function submit() {
    if (!form.name || !form.email) {
      alert("Podaj imię/nazwisko i email.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        qty,
        ...form,
      }),
    });
    setLoading(false);
    alert(res.ok ? "Dziękujemy! Wysłaliśmy maila z danymi do przelewu." : "Błąd — spróbuj ponownie lub napisz do nas.");
  }

  return (
    <div className="card space-y-3">
      <div className="text-xl font-semibold">{product.name}</div>
      <div className="text-dim">{product.price} ISK</div>

      <label className="block text-sm">Ilość
        <input type="number" min={1} value={qty} onChange={e=>setQty(parseInt(e.target.value||"1"))} className="input w-24 mt-1"/>
      </label>

      <input placeholder="Imię i nazwisko" className="input"
             value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
      <input placeholder="Email" className="input"
             value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
      <input placeholder="Telefon" className="input"
             value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
      <input placeholder="Adres dostawy (opcjonalnie)" className="input"
             value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/>
      <textarea placeholder="Uwagi (opcjonalnie)" className="input"
                value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>

      <button onClick={submit} disabled={loading} className="btn">
        {loading ? "Wysyłam..." : "Kup"}
      </button>
      <p className="text-xs text-dim">Klikając „Kup”, wyrażasz zgodę na przetwarzanie danych w celu realizacji zamówienia.</p>
    </div>
  );
}
