import { getProduct } from "@/lib/db";
import AdminForm from "../../product-form";

export default async function Page({ params }: { params: { id: string }}) {
  const p = await getProduct(params.id);
  if (!p) return <div className="p-6">Not found</div>;
  return (
    <main className="max-w-4xl mx-auto p-6">
      <AdminForm initial={p} />
    </main>
  );
}
