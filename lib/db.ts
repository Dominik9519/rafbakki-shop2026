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
const BLOB_PATH = "products/products.json"; // stała ścieżka
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

let memory: Product[] | null = Array.isArray(seed) ? [...seed] : null;
let loadedFromBlob = false;

async function ensureFileExists() {
  if (!USE_BLOB) return;
  const files = await list({ prefix: BLOB_PATH, token: TOKEN });
  const file = files.blobs.find((b) => b.pathname === BLOB_PATH);
  if (!file) {
    // jeśli plik nie istnieje – zapisz seed
    await put(BLOB_PATH, JSON.stringify(memory ?? [], null, 2), {
      access: "public",
      contentType: "application/json",
      token: TOKEN,
    });
  }
}

async function readFromBlob(): Promise<Product[] | null> {
  if (!USE_BLOB) return null;
  await ensureFileExists();
  const files = await list({ prefix: BLOB_PATH, token: TOKEN });
  const file = files.blobs.find((b) => b.pathname === BLOB_PATH);
  if (!file) return null;

  const res = await fetch(file.url + "?cache-bust=" + Date.now(), { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  const items = Array.isArray(json) ? json : json?.items;
  return Array.isArray(items) ? (items as Product[]) : [];
}

async function writeToBlob(items: Product[]): Promise<PutBlobResult | null> {
  if (!USE_BLOB) return null;
  return await put(BLOB_PATH, JSON.stringify(items, null, 2), {
    access: "public",
    contentType: "application/json",
    token: TOKEN,
  });
}

async function ensureLoaded() {
  if (loadedFromBlob) return;
  const blob = await readFromBlob();
  memory = blob ?? memory ?? [];
  loadedFromBlob = true;
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
  loadedFromBlob = false; // wymuś ponowne wczytanie przy następnym requestcie
}

export async function deleteProduct(id: string): Promise<void> {
  await ensureLoaded();
  const items = (memory ?? []).filter((p) => p.id !== id);
  memory = items;
  await writeToBlob(items);
  loadedFromBlob = false;
}

export async function listCategories(): Promise<string[]> {
  await ensureLoaded();
  const items = memory ?? [];
  const set = new Set<string>();
  for (const p of items) {
    if (p.category) set.add(p.category);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
