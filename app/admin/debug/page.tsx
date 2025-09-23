import { cookies, headers } from "next/headers";

export const dynamic = "force-dynamic";

export default function DebugAdmin() {
  const ck = cookies();
  const admin = ck.get("admin")?.value;
  const host = headers().get("host");
  const env = process.env.ADMIN_PASSWORD ? "SET" : "MISSING";

  return (
    <main className="max-w-lg mx-auto p-6 space-y-3">
      <h1 className="text-xl font-bold">Debug admin</h1>
      <div className="card">
        <div>Host: <b>{host}</b></div>
        <div>Cookie <code>admin</code>: <b>{admin ?? "(brak)"}</b></div>
        <div>ENV ADMIN_PASSWORD: <b>{env}</b></div>
        <p className="text-dim text-sm mt-2">
          Jeśli po poprawnym logowaniu cookie jest nadal „brak”, znaczy że nie zostało ustawione.
        </p>
      </div>
      <a className="btn" href="/admin/login">↩︎ Wróć do logowania</a>
    </main>
  );
}
