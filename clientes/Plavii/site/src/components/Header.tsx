"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import CategoryDrawer from "@/components/CategoryDrawer";
import SearchBar from "@/components/SearchBar";
import UserMenu from "@/components/UserMenu";
import LineIcon from "@/components/LineIcon";
import type { Category } from "@/lib/categories";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

// Só as N primeiras ficam sempre visíveis na barra; o resto fica no painel "Tudo"
const QUICK_COUNT = 8;

export default function Header({ categories }: { categories: Category[] }) {
  const quickCategories = categories.slice(0, QUICK_COUNT);
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // Some ao rolar pra baixo e volta ao rolar pra cima
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (y < 80) setHidden(false);
        else if (delta > 6) setHidden(true);
        else if (delta < -6) setHidden(false);
        if (Math.abs(delta) > 6 || y < 80) lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur transition-transform duration-300 ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 md:flex-nowrap md:gap-x-4">
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="Plavii" width={110} height={36} priority />
        </Link>

        {/* Celular: busca ocupa a linha de baixo inteira; conta+carrinho ficam em cima. Desktop: tudo numa linha só. */}
        <SearchBar className="order-3 w-full md:order-none md:min-w-0 md:flex-1" />

        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {user ? (
            <UserMenu />
          ) : (
            <Link
              href="/entrar"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-brand bg-brand px-3 py-2 text-sm font-semibold text-white transition-colors hover:border-brand-dark hover:bg-brand-dark"
            >
              <LineIcon name="user" className="h-5 w-5" />
              Entrar
            </Link>
          )}

          <Link
            href="/carrinho"
            aria-label="Carrinho"
            className="relative flex items-center rounded-full bg-brand px-3 py-2 text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h9.3a1 1 0 0 0 1-.8L21 7H6" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="bg-brand-dark text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-extrabold transition-colors hover:bg-white/15"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Tudo
          </button>
          <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/categoria/${c.slug}`}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                {c.nome}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
    <CategoryDrawer open={menuOpen} onClose={closeMenu} categories={categories} />
    </>
  );
}
