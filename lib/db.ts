// lib/db.ts
import seed from "@/data/products.json";
import type { PutBlobResult } from "@vercel/blob";
import { put, list } from "@vercel/blob";

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: string;
  createdAt?: number;
  updatedAt?: number;
};

const USE_BLOB = process.env.USE_BLOB === "true";
const BLOB_PATH = process.env.BLOB_KEY || "products/products.json";
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN; // opcjonalny – do dev

let memory: Product[] | null = Array.isArray(seed) ? [...seed] : null;
let loadedFromBlob = false;

async function readFromBlob(): Promise<Product[] | null> {
  if (!USE_BLOB) return null;
  try {
    const files = await list({ prefix: BLOB_PATH, token: TOKEN });
    const file = files.blobs.find((b) => b.pathname === BLOB_PATH);
    if (!file) return null;

    const res = await fetch(file.url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const items = Array.isArray(json) ? json : json?.items;
    if (!Array.isArray(items)) return null;
    return items as Product[];
  } catch (err) {
    console.error("readFromBlob error", err);
    return null;
  }
}

async function writeToBlob(items: Product[]): Promise<PutBlobResult | null> {
  if (!USE_BLOB) return null;
  const data = JSON.stringify(items, null, 2);
  return await put(BLOB_PATH, data, {
    access: "public",
    contentType: "application/json",
    token: TOKEN,
  });
}

async function ensureLoaded() {
  if (loadedFromBlob) return;
  const blob = await readFromBlob();
  if (blob && Array.isArray(blob)) {
    memory = blob;
    loadedFromBlob = true;
  } else if (memory == null) {
    memory = [];
  }
}

export async function listProducts(): Promise<Product[]> {
  await ensureLoaded();
  return memory ?? [];
}

export async function getProduct(id: string): Promise<Product | null> {
  await ensureLoaded();
  return (memory ?? []).find((p) => p.id === id) ?? null;
}

export async function saveProduct(p: Product): Promise<void> {
  await ensureLoaded();
  const now = Date.now();
  const items = memory ?? [];
  const i = items.findIndex((x) => x.id === p.id);
  if (i >= 0) {
    items[i] = { ...items[i], ...p, updatedAt: now };
  } else {
    items.unshift({ ...p, createdAt: now, updatedAt: now });
  }
  memory = items;
  await writeToBlob(items);
}

export async function deleteProduct(id: string): Promise<void> {
  await ensureLoaded();
  const items = (memory ?? []).filter((p) => p.id !== id);
  memory = items;
  await writeToBlob(items);
}

export async function clearAllProducts(): Promise<void> {
  await ensureLoaded();
  memory = [];
  await writeToBlob([]);
}

export async function replaceAllProducts(items: Product[]): Promise<void> {
  await ensureLoaded();
  memory = [...items];
  await writeToBlob(memory);
}

export async function exportAll(): Promise<{ exportedAt: string; items: Product[] }> {
  await ensureLoaded();
  return { exportedAt: new Date().toISOString(), items: memory ?? [] };
}
