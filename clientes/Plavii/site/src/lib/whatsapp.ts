import { formatPrice } from "./products";
import type { CartItem, Product } from "./types";

// Número da loja Plavii (2026-10-05) — DDI+DDD+número, só dígitos
export const WHATSAPP_NUMBER = "5561992332876";

export function buildCartWhatsappUrl(
  items: CartItem[],
  products: Product[],
  totalPrice: number,
  customerName?: string
): string {
  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return `• ${item.quantity}x ${product.name} — ${formatPrice(product.price * item.quantity)}`;
    })
    .filter((line): line is string => line !== null);

  const name = customerName?.replace(/\s+/g, " ").trim().slice(0, 60);
  const what = lines.length === 1 ? "este produto" : "estes produtos";
  const message = [
    name
      ? `Olá! Meu nome é ${name}. Tenho interesse em comprar ${what} que vi no site:`
      : `Olá! Tenho interesse em comprar ${what} que vi no site:`,
    "",
    ...lines,
    "",
    `Total: ${formatPrice(totalPrice)}`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
