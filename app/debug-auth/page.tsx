import { cookies, headers } from "next/headers";

export const dynamic = "force-dynamic";

export default function DebugAuth() {
  const ck = cookies();
  const admin = ck.get("admin")?.value ?? "(brak)";
  const host = headers().get("host");
  const env = process.env.ADMIN_PASSWORD ? "SET" : "MISSING";

  return (
    <main className="max-w-lg mx-auto p-6 space-y-3">
      <h1 className="text-xl font-bold">Debug auth</h1>
      <div className="card">
        <div>Host: <b>{host}</b></div>
        <div>Cookie <code>admin</code>: <b>{admin}</b></div>
        <div>ENV ADMIN_PASSWORD: <b>{env}</b></div>
        <p className="text-dim text-sm mt-2">
          Po zalogowaniu sprawdź tu ponownie, czy pojawia się <code>admin=1</code>.
        </p>
      </div>
      <a className="btn" href="/admin/login">↩︎ Przejdź do logowania</a>
    </main>
  );
}
