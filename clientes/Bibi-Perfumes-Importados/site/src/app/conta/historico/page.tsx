"use client";

import Link from "next/link";
import LineIcon from "@/components/LineIcon";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/lib/cart-context";
import { clearHistory, useHistory, type HistoryItem } from "@/lib/personal";
import type { Product } from "@/lib/types";

function viewedLabel(at: number): string {
  const date = new Date(at);
  const today = new Date();
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const days = Math.floor(
    (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() -
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) /
      86_400_000
  );
  if (days <= 0) return `Visto hoje às ${time}`;
  if (days === 1) return `Visto ontem às ${time}`;
  return `Visto em ${date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
}

export default function HistoricoPage() {
  const history = useHistory();
  const { products } = useCart();

  const viewed = history
    .map((item) => ({ item, product: products.find((p) => p.id === item.id) }))
    .filter((v): v is { item: HistoryItem; product: Product } => !!v.product);
  const loading = history.length > 0 && products.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-dark">Histórico</h1>
          <p className="text-sm text-neutral-500">
            Perfumes que você viu neste navegador, do mais recente pro mais antigo.
          </p>
        </div>
        {viewed.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <LineIcon name="trash" className="h-4 w-4" />
            Limpar histórico
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-neutral-400">Carregando…</p>}

      {!loading && viewed.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
          <LineIcon name="clock" className="mx-auto h-12 w-12 text-brand-light" />
          <p className="mt-4 text-lg font-bold text-neutral-800">Nada por aqui ainda</p>
          <p className="mt-1 text-neutral-500">Os perfumes que você abrir vão aparecer aqui.</p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Ver perfumes
          </Link>
        </div>
      )}

      {viewed.length > 0 && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {viewed.map(({ item, product }) => (
            <div key={item.id} className="flex flex-col gap-1.5">
              <ProductCard product={product} />
              <p className="text-center text-xs text-neutral-400">{viewedLabel(item.at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
