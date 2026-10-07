import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product);

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-50 p-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain transition-transform hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-brand-dark shadow-sm">
          {product.volumeMl}ml
        </span>
        {off && (
          <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-1 text-xs font-bold text-white">
            -{off}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-black/5 p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-neutral-800">
          {product.name}
        </h3>
        <span className="text-lg font-extrabold text-brand">
          {formatPrice(product.price)}
        </span>
        {product.oldPrice && (
          <span className="text-xs text-neutral-400 line-through">
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </div>
    </Link>
  );
}
