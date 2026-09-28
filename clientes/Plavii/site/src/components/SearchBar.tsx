"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import LineIcon from "@/components/LineIcon";
import { formatPrice, getAllProducts } from "@/lib/products";
import { searchProducts } from "@/lib/search";
import type { Product } from "@/lib/types";

export default function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [products, setProducts] = useState<Product[] | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Carrega o catálogo na primeira vez que a pessoa clica na barra
  const loadProducts = () => {
    if (products) return;
    getAllProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  };

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const term = query.trim();
  const suggestions = products && term ? searchProducts(products, term).slice(0, 5) : [];
  const showList = open && term.length > 0;

  const goToResults = () => {
    if (!term) return;
    setOpen(false);
    router.push(`/busca?q=${encodeURIComponent(term)}`);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (active >= 0 && suggestions[active]) {
      setOpen(false);
      router.push(`/produto/${suggestions[active].slug}`);
      return;
    }
    goToResults();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    }
  };

  return (
    <div ref={boxRef} className={`md:relative ${className}`}>
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex overflow-hidden rounded-lg border border-neutral-300 bg-white transition-colors focus-within:border-brand"
      >
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => {
            loadProducts();
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar produtos, categorias…"
          aria-label="Buscar produtos"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-neutral-400"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="flex w-11 items-center justify-center bg-brand text-white transition-colors hover:bg-brand-dark"
        >
          <LineIcon name="search" className="h-5 w-5" />
        </button>
      </form>

      {showList && (
        // Celular: a barra é estreita (a conta fica ao lado), então a lista abre na largura do cabeçalho
        <div className="absolute left-4 right-4 top-[calc(100%-0.75rem)] z-50 mt-1 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/10 md:left-0 md:right-0 md:top-full">
          {!products ? (
            <p className="px-4 py-3 text-sm text-neutral-500">Buscando…</p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-neutral-500">
              Nada encontrado para &ldquo;{term}&rdquo;
            </p>
          ) : (
            <ul>
              {suggestions.map((p, i) => (
                <li key={p.id}>
                  <a
                    href={`/produto/${p.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      router.push(`/produto/${p.slug}`);
                    }}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center gap-3 px-3 py-2 ${
                      i === active ? "bg-brand/5" : ""
                    }`}
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-neutral-50">
                      <Image src={p.image} alt="" fill sizes="40px" className="object-contain" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-neutral-800">
                      {p.name}
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-brand">
                      {formatPrice(p.price)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {products && suggestions.length > 0 && (
            <button
              type="button"
              onClick={goToResults}
              className="block w-full border-t border-neutral-100 px-4 py-2.5 text-left text-sm font-medium text-brand hover:bg-brand/5"
            >
              Ver todos os resultados para &ldquo;{term}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
