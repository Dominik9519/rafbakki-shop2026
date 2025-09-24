export default function AdminLogin({ searchParams }: { searchParams?: { error?: string } }) {
  const hasError = searchParams?.error === "invalid";
  return (
    <main className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Rafbakki – Admin</h1>
      <form action="/api/admin/login" method="post" className="space-y-3">
        <input name="password" type="password" placeholder="Admin password" className="input w-full" required />
        {hasError && (
          <p className="text-sm text-red-400 bg-red-950/30 p-2 rounded">❌ Nieprawidłowe hasło lub brak ADMIN_PASSWORD.</p>
        )}
        <button type="submit" className="btn w-full">Log in</button>
      </form>
    </main>
  );
}
