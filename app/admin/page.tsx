import { listProducts } from "@/lib/db";
import AdminProducts from "./AdminProducts";
import AdminProductsTools from "./AdminProductsTools"; // jeśli używasz eksport/import

export default async function AdminPage() {
  const items = await listProducts();
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Stjórnandi – vörur</h1>
      <AdminProductsTools />
      <AdminProducts initialItems={items} />
    </main>
  );
}
