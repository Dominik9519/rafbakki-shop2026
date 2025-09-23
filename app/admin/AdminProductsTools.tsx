"use client";
import { useRef, useState } from "react";

export default function AdminProductsTools() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    const res = await fetch("/api/admin/export-products");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rafbakki-products-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(file: File) {
    setLoading(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch("/api/admin/import-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Import failed");
      alert(`Zaimportowano ${data.count} produktów (w pamięci). Aby trwale zapisać: podmień plik data/products.json w repo i zrób deploy.`);
      location.reload();
    } catch (e: any) {
      alert("Błąd importu: " + e.message);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="card mt-4 flex items-center gap-3">
      <button className="btn" onClick={handleExport}>Eksportuj (JSON)</button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
      />
      <button className="btn-ghost" onClick={() => inputRef.current?.click()} disabled={loading}>
        {loading ? "Importuję..." : "Importuj z JSON"}
      </button>
    </div>
  );
}
