"use client";

import Link from "next/link";
import LineIcon from "@/components/LineIcon";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-brand/10 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <LineIcon name="droplet" className="h-6 w-6 text-brand" />
          <span className="font-serif text-xl font-bold tracking-tight text-brand-dark">
            Bibi Perfumes
          </span>
        </Link>

        <Link
          href="/carrinho"
          aria-label="Carrinho"
          className="relative flex items-center justify-center rounded-full bg-brand px-3 py-2 text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          <LineIcon name="cart" className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-brand-dark">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
