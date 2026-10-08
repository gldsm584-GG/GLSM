import { formatPrice } from "./products";
import type { CartItem, Product } from "./types";

// Número da loja Bibi Perfumes (2026-10-06) — DDI+DDD+número, só dígitos
export const WHATSAPP_NUMBER = "556199173630";

export function buildCartWhatsappUrl(
  items: CartItem[],
  products: Product[],
  totalPrice: number,
  customerName?: string,
  address?: string
): string {
  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return `• ${item.quantity}x ${product.name} (${product.volumeMl}ml) — ${formatPrice(
        product.price * item.quantity
      )}`;
    })
    .filter((line): line is string => line !== null);

  const name = customerName?.replace(/\s+/g, " ").trim().slice(0, 60);
  const where = address?.replace(/\s+/g, " ").trim().slice(0, 200);
  const what = lines.length === 1 ? "este perfume" : "estes perfumes";
  const message = [
    name
      ? `Olá! Meu nome é ${name}. Tenho interesse em comprar ${what} que vi no site:`
      : `Olá! Tenho interesse em comprar ${what} que vi no site:`,
    "",
    ...lines,
    "",
    `Total: ${formatPrice(totalPrice)}`,
    ...(where ? ["", `Meu endereço: ${where}`] : []),
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
