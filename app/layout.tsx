import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { CartProvider } from "@/app/context/CartContext";
import CartBadge from "@/components/CartBadge";

export const metadata: Metadata = {
  title: "Rafbakki – Verslun",
  description: "Rafbakki slf. – verslun (pöntun, millifærsla).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="is">
      <body>
        <CartProvider>
          {/* ===== Górna belka w stylu strony głównej ===== */}
          <header className="glass-header">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              {/* Logo + tytuł */}
              <div className="brand">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                  {/* Możesz tu wstawić <Image src="/logo.svg" .../> */}
                  <img
          src="/logo.png"
          alt="Rafbakki logo"
          className="h-16 w-auto"
        />
                </Link>
              </div>

              {/* Nawigacja */}
              <nav className="flex items-center gap-2 text-sm">
                <Link href="/" className="navlink">Hafa samband</Link>
                <Link href="/cart" className="navlink">Karfa <CartBadge /></Link>
                <Link href="/admin" className="navlink">Stjórnandi</Link>
              </nav>
            </div>
            <div className="header-divider" />
          </header>

          {/* Treść strony */}
          {children}

          {/* Stopka */}
          <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-dim">
            © {new Date().getFullYear()} Rafbakki slf.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
