export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/auth";
import { listProducts } from "@/lib/db";
import AdminProducts from "./AdminProducts";
import AdminProductsTools from "./AdminProductsTools";

export default async function AdminPage() {
  await requireAdmin();
  const items = await listProducts();

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Stjórnandi – vörur</h1>
      <AdminProductsTools />
      <AdminProducts initialItems={items} />
    </main>
  );
}
