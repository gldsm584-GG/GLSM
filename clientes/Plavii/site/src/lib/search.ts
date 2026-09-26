import type { Product } from "./types";

export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Busca por todas as palavras digitadas (em qualquer ordem), sem ligar pra
// acento ou maiúscula, em nome, categoria e descrição. Nome vem primeiro.
export function searchProducts(products: Product[], query: string): Product[] {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return products
    .map((product) => {
      const name = normalizeText(product.name);
      const rest = normalizeText(`${product.category} ${product.description}`);
      const haystack = `${name} ${rest}`;
      if (!terms.every((t) => haystack.includes(t))) return null;
      const inName = terms.every((t) => name.includes(t));
      return { product, score: inName ? 0 : 1 };
    })
    .filter((r): r is { product: Product; score: number } => r !== null)
    .sort((a, b) => a.score - b.score)
    .map((r) => r.product);
}
