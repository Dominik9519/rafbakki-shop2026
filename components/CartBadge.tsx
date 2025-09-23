"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function CartBadge() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? items.reduce((n, i) => n + i.qty, 0) : 0;

  return (
    <span
      suppressHydrationWarning
      className={`ml-2 inline-block min-w-6 text-center text-xs border rounded-full px-2 ${
        count === 0 ? "opacity-60" : ""
      }`}
    >
      {count}
    </span>
  );
}
