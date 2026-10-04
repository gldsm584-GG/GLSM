import { formatPrice } from "./products";
import type { CartItem, Product } from "./types";

// Número de TESTE do Gustavo (2026-10-04) — troque pelo número de verdade da loja
// antes de apresentar ao dono (DDI+DDD+número, só dígitos)
export const WHATSAPP_NUMBER = "5561991918921";

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
  const message = [
    name ? `Olá! Meu nome é ${name}. Quero comprar:` : "Olá! Quero comprar:",
    "",
    ...lines,
    "",
    `Total: ${formatPrice(totalPrice)}`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
