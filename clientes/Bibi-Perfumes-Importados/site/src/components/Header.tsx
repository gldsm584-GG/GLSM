"use client";

import Image from "next/image";
import Link from "next/link";
import LineIcon from "@/components/LineIcon";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

function AccountButton() {
  const { user, loading } = useAuth();

  // Enquanto confere a sessão, guarda o espaço pra não "pular" o layout
  if (loading) return <span className="h-10 w-10" aria-hidden="true" />;

  if (!user) {
    return (
      <Link
        href="/entrar"
        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-brand-dark ring-1 ring-brand/30 transition-colors hover:bg-brand/10"
      >
        <LineIcon name="user" className="h-5 w-5" />
        Entrar
      </Link>
    );
  }

  return <UserMenu user={user} />;
}

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-brand/10 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt=""
            width={44}
            height={44}
            priority
            className="h-11 w-11 shrink-0 rounded-full shadow-sm"
          />
          <span className="truncate font-serif text-2xl font-semibold tracking-wide text-brand-dark">
            Bibi Perfumes
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <AccountButton />
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
      </div>
    </header>
  );
}
