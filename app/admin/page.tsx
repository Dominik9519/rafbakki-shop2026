// app/admin/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireAdmin } from "@/lib/auth";
import { listProducts } from "@/lib/db";
import AdminProducts from "./AdminProducts";
import AdminProductsTools from "./AdminProductsTools";

export default async function AdminPage() {
  // 🔒 Ochrona – wymaga cookie admin=1
  await requireAdmin();

  // pobierz listę produktów (z pamięci lub bazy)
  const items = await listProducts();

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Nagłówek strony z przyciskiem Wyloguj */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stjórnandi – vörur</h1>
        <form action="/api/admin/logout" method="post">
          <button className="btn-ghost text-sm">🚪 Wyloguj</button>
        </form>
      </div>

      {/* Panel dodawania/edycji produktów */}
      <AdminProductsTools />

      {/* Lista produktów */}
      <AdminProducts initialItems={items} />
    </main>
  );
}
