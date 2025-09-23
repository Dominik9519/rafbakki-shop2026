// lib/db.ts
import fileProducts from "@/data/products.json";

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: string; // ⬅️ NOWE
};

// Pamięć startuje zawartością z pliku (zero KV)
let memory: Product[] = Array.isArray(fileProducts) ? [...fileProducts] : [];

// ===== Publiczne API =====
export async function listProducts(): Promise<Product[]> {
  return memory;
}

export async function getProduct(id: string): Promise<Product | null> {
  return memory.find(p => p.id === id) ?? null;
}

export async function saveProduct(p: Product): Promise<void> {
  const i = memory.findIndex(x => x.id === p.id);
  if (i >= 0) memory[i] = p;
  else memory.push(p);
}

export async function deleteProduct(id: string): Promise<void> {
  memory = memory.filter(p => p.id !== id);
}

export async function clearAllProducts(): Promise<void> {
  memory = [];
}

export async function replaceAllProducts(items: Product[]): Promise<void> {
  memory = [...items];
}

export async function exportAll(): Promise<{ exportedAt: string; items: Product[] }> {
  return { exportedAt: new Date().toISOString(), items: memory };
}

// ⬇️ unikalne kategorie (posortowane)
export async function listCategories(): Promise<string[]> {
  const set = new Set<string>();
  for (const p of memory) {
    if (p.category && p.category.trim()) set.add(p.category.trim());
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
