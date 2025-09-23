import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminLogin({
  searchParams,
}: { searchParams?: { error?: string } }) {
  // Server Action – zwraca void
  async function login(formData: FormData) {
    "use server";
    const input = (formData.get("password") ?? "").toString();
    const ok = !!process.env.ADMIN_PASSWORD && input === process.env.ADMIN_PASSWORD;

    if (!ok) {
      // nic nie zwracamy – tylko redirect (typ: Promise<void>)
      redirect("/admin/login?error=invalid");
    }

    // proste zalogowanie: cookie admin=1 (dopasuj do swojego requireAdmin, jeśli masz)
    cookies().set("admin", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      // maxAge: 60 * 60 * 8, // 8h – opcjonalnie
    });

    redirect("/admin");
  }

  const hasError = searchParams?.error === "invalid";

  return (
    <form action={login} className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Rafbakki – Admin</h1>

      <input
        name="password"
        type="password"
        placeholder="Admin password"
        className="input"
        required
      />
      {hasError && (
        <p className="text-sm text-red-400">Nieprawidłowe hasło.</p>
      )}

      <button className="btn">Log in</button>
    </form>
  );
}
