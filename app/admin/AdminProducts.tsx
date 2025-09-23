"use client";
import { useState } from "react";
import type { Product } from "@/lib/db";
import AdminProductForm from "./AdminProductForm";

export default function AdminProducts({ initialItems }: { initialItems: Product[] }) {
  const [items, setItems] = useState<Product[]>(initialItems);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function removeOne(id: string) {
    if (!confirm("Na pewno usunąć ten produkt?")) return;
    const prev = items;
    setItems(prev.filter((p) => p.id !== id));
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Nie udało się usunąć.");
      setItems(prev);
    }
  }

  function handleSavedUpsert(p: Product) {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = p;
        return copy;
      }
      return [p, ...prev];
    });
    setAdding(false);
    setEditingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Lista produktów</h2>
        {!adding && <button className="btn" onClick={() => setAdding(true)}>Dodaj produkt</button>}
      </div>

      {adding && (
        <AdminProductForm onSaved={handleSavedUpsert} onCancel={() => setAdding(false)} isEdit={false} />
      )}

      {items.length === 0 ? (
        <div className="text-dim">Brak produktów.</div>
      ) : (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <li key={p.id} className="card space-y-3">
              {editingId === p.id ? (
                <AdminProductForm
                  initial={p}
                  isEdit
                  onSaved={handleSavedUpsert}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex gap-3">
                    {p.imageUrl && (
                      <div className="w-28 h-20 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{p.name}</div>
                      <div className="text-dim text-sm">{p.price} ISK</div>
                      <div className="text-dim text-xs truncate">{p.id}</div>
                    </div>
                  </div>
                    {p.category && <div className="text-dim text-xs">Kategoria: {p.category}</div>}

                  <div className="flex items-center gap-2">
                    <a href={`/product/${p.id}`} className="btn-ghost">Podgląd</a>
                    <button className="btn-ghost" onClick={() => setEditingId(p.id)}>Edytuj</button>
                    <button className="btn-ghost text-red-400 hover:text-red-300" onClick={() => removeOne(p.id)}>
                      Usuń
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
