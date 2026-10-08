"use client";

import Link from "next/link";
import LineIcon from "@/components/LineIcon";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/personal";
import type { Product } from "@/lib/types";

export default function FavoritosPage() {
  const favorites = useFavorites();
  const { products } = useCart();

  const saved = favorites
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);
  const loading = favorites.length > 0 && products.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-dark">Favoritos</h1>
        <p className="text-sm text-neutral-500">
          Perfumes que você marcou com o coração neste navegador.
        </p>
      </div>

      {loading && <p className="text-sm text-neutral-400">Carregando…</p>}

      {!loading && saved.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
          <LineIcon name="heart" className="mx-auto h-12 w-12 text-brand-light" />
          <p className="mt-4 text-lg font-bold text-neutral-800">Nenhum favorito ainda</p>
          <p className="mt-1 text-neutral-500">
            Toque no coração de um perfume pra guardar ele aqui.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Ver perfumes
          </Link>
        </div>
      )}

      {saved.length > 0 && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
