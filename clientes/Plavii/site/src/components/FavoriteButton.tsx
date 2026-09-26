"use client";

import LineIcon from "@/components/LineIcon";
import { toggleFavorite, useFavorites } from "@/lib/personal";

export default function FavoriteButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const favorites = useFavorites();
  const active = favorites.includes(productId);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 transition-colors ${
        active ? "text-red-500" : "text-neutral-400 hover:text-red-500"
      } ${className}`}
    >
      <LineIcon name="heart" filled={active} className="h-5 w-5" />
    </button>
  );
}
