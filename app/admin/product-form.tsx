import { z } from "zod";
import { saveProduct } from "@/lib/db";
import { revalidatePath } from "next/cache";
import ImageUploader from "@/components/ImageUploader";
import { v4 as uuid } from "uuid";

const schema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export default function AdminForm({ initial }: { initial?: any }) {
  async function submit(formData: FormData) {
    "use server";
    const obj: any = {};
    formData.forEach((v, k) => { obj[k] = v; });
    const parsed = schema.parse(obj);
    const id = (initial?.id as string) || uuid();
    await saveProduct({
      id,
      name: parsed.name,
      price: parsed.price,
      description: parsed.description,
      imageUrl: parsed.imageUrl,
      createdAt: Date.now(),
    });
    revalidatePath("/admin");
    revalidatePath("/");
  }

  return (
    <form action={submit} className="card space-y-3">
      <h2 className="font-semibold">{initial ? "Edit product" : "Add product"}</h2>
      <input name="name" defaultValue={initial?.name} placeholder="Name" className="input"/>
      <input name="price" defaultValue={initial?.price} placeholder="Price (ISK)" type="number" className="input"/>
      <textarea name="description" defaultValue={initial?.description} placeholder="Description" className="input"/>
      <div className="space-y-2">
        <input id="imageUrl" name="imageUrl" defaultValue={initial?.imageUrl} placeholder="Image URL" className="input"/>
        <ImageUploader targetInputId="imageUrl" />
        <p className="text-xs text-dim">Wgraj obraz albo wklej URL. Po uploadzie URL ustawi się automatycznie.</p>
      </div>
      <button className="btn">{initial ? "Save changes" : "Add product"}</button>
    </form>
  );
}
