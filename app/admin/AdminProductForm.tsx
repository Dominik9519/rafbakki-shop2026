"use client";
import { useState } from "react";

type FormProduct = {
  id: string;
  name: string;
  price: number | string;
  imageUrl?: string;
  description?: string;
  category?: string; // ⬅️ DODANE
};

export default function AdminProductForm({
  initial,
  onSaved,
  onCancel,
  isEdit = false,
}: {
  initial?: Partial<FormProduct>;
  onSaved: (p: any) => void;
  onCancel: () => void;
  isEdit?: boolean;
}) {
  const [form, setForm] = useState<FormProduct>({
    id: initial?.id ?? "",
    name: initial?.name ?? "",
    price: initial?.price ?? "",
    imageUrl: initial?.imageUrl ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "", // ⬅️ DODANE
  });
  const [loading, setLoading] = useState(false);

  async function submit() {
    const priceNum = Number(form.price);
    if (!form.id.trim() || !form.name.trim() || !Number.isFinite(priceNum)) {
      alert("Uzupełnij poprawnie: ID, Nazwę i Cenę (liczba).");
      return;
    }

    setLoading(true);
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `/api/admin/products/${encodeURIComponent(form.id)}`
        : "/api/admin/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id.trim(),
          name: form.name.trim(),
          price: priceNum,
          imageUrl: form.imageUrl?.trim() || undefined,
          description: form.description?.trim() || undefined,
          category: form.category?.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Błąd zapisu");
      onSaved(data.product);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-dim">ID produktu</label>
          <input
            className="input mt-1"
            placeholder="np. nvr4108hs-ei"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            disabled={isEdit} // ID nie zmieniamy przy edycji
          />
        </div>

        <div>
          <label className="text-xs text-dim">Cena (ISK)</label>
          <input
            className="input mt-1"
            type="number"
            inputMode="numeric"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="np. 19990"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs text-dim">Nazwa</label>
          <input
            className="input mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Pełna nazwa produktu"
          />
        </div>

        {/* ⬇️ Nowe pole: kategoria */}
        <div className="md:col-span-2">
          <label className="text-xs text-dim">Kategoria</label>
          <input
            className="input mt-1"
            placeholder="np. Kamery, NVR, Akcesoria"
            value={form.category ?? ""}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs text-dim">Obraz (URL)</label>
          <input
            className="input mt-1"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://... lub /images/plik.png"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs text-dim">Opis</label>
          <textarea
            className="input mt-1"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Krótki opis/specyfikacja"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn" onClick={submit} disabled={loading}>
          {loading ? "Zapisuję..." : isEdit ? "Zapisz zmiany" : "Dodaj produkt"}
        </button>
        <button className="btn-ghost" onClick={onCancel}>Anuluj</button>
      </div>
    </div>
  );
}
