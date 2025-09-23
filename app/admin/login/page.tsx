import { redirect } from "next/navigation";
import { isAuthed, setAuthedCookie } from "@/lib/auth";

export default function Page() {
  if (isAuthed()) redirect("/admin");
  async function login(formData: FormData) {
    "use server";
    const pass = String(formData.get("password") || "");
    if (pass === process.env.ADMIN_PASSWORD) {
      setAuthedCookie();
      redirect("/admin");
    }
    return { error: "Wrong password" };
  }
  return (
    <form action={login} className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Rafbakki – Admin</h1>
      <input name="password" type="password" placeholder="Admin password" className="input"/>
      <button className="btn">Log in</button>
      <p className="text-xs text-dim">Access restricted.</p>
    </form>
  );
}
