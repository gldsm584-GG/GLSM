"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LineIcon from "@/components/LineIcon";
import { useCart } from "@/lib/cart-context";

export default function AddToCart({ productId }: { productId: string }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(productId, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(productId, quantity);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>Quantidade</span>
        <div className="flex items-center rounded-md border border-neutral-200">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:text-brand"
            aria-label="Diminuir quantidade"
          >
            <LineIcon name="minus" className="h-3.5 w-3.5" />
          </button>
          <span className="w-7 text-center text-sm font-semibold text-neutral-800">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:text-brand"
            aria-label="Aumentar quantidade"
          >
            <LineIcon name="plus" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={handleBuyNow}
        className="mt-1 w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Comprar agora
      </button>
      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand/10 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/20"
      >
        {added ? (
          <>
            Adicionado <LineIcon name="check" className="h-4 w-4" />
          </>
        ) : (
          <>
            <LineIcon name="cart" className="h-4 w-4" />
            Adicionar ao carrinho
          </>
        )}
      </button>
    </div>
  );
}
