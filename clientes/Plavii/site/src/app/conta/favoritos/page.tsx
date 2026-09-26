"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LineIcon from "@/components/LineIcon";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/lib/personal";
import { getAllProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export default function FavoritosPage() {
  const favorites = useFavorites();
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const saved = products
    ? favorites
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => !!p)
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-800">Favoritos</h1>
        <p className="text-sm text-neutral-500">
          Produtos que você marcou com o coração neste navegador.
        </p>
      </div>

      {saved && saved.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
          <LineIcon name="heart" className="mx-auto h-12 w-12 text-neutral-300" />
          <p className="mt-4 text-lg font-bold text-neutral-800">Nenhum favorito ainda</p>
          <p className="mt-1 text-neutral-500">
            Toque no coração de um produto pra guardar ele aqui.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Ver produtos
          </Link>
        </div>
      )}

      {saved && saved.length > 0 && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
