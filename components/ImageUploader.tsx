"use client";
import { useState } from "react";

export default function ImageUploader({ targetInputId }: { targetInputId: string }) {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState<string|undefined>();

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/blob-upload", { method: "POST", body: fd });
    const json = await res.json();
    setBusy(false);
    if (json.url) {
      setUrl(json.url);
      const input = document.getElementById(targetInputId) as HTMLInputElement | null;
      if (input) input.value = json.url;
    } else {
      alert("Upload failed");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input type="file" accept="image/*" onChange={handle} className="text-sm"/>
      {busy && <span className="text-sm text-dim">Uploading…</span>}
      {url && <a href={url} target="_blank" className="text-xs underline">Open</a>}
    </div>
  );
}
