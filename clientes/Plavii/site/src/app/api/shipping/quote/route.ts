import { NextResponse } from "next/server";
import { onlyDigits, quoteShipping, shippingConfigured } from "@/lib/shipping";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Cotação de frete pro checkout. Só pra quem está logado (evita uso aberto da
// conta do Melhor Envio) e o preço dos produtos vem do banco, não do navegador.
export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const { data: caller } = await supabaseAdmin.auth.getUser(token);
  if (!caller.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const cep = onlyDigits(String(body?.cep ?? ""));
  const rawItems: unknown = body?.items;

  if (cep.length !== 8 || !Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 50) {
    return NextResponse.json({ error: "CEP ou itens inválidos" }, { status: 400 });
  }

  const wanted = rawItems
    .map((item) => ({
      productId: String((item as { productId?: unknown })?.productId ?? ""),
      quantity: Math.floor(Number((item as { quantity?: unknown })?.quantity)),
    }))
    .filter((item) => item.productId && Number.isFinite(item.quantity) && item.quantity > 0 && item.quantity <= 99);

  if (wanted.length === 0) {
    return NextResponse.json({ error: "CEP ou itens inválidos" }, { status: 400 });
  }

  if (!shippingConfigured()) {
    return NextResponse.json({ configured: false, options: [] });
  }

  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, price")
    .in("id", wanted.map((item) => item.productId));

  const items = wanted
    .map((item) => {
      const product = products?.find((p) => p.id === item.productId);
      return product ? { quantity: item.quantity, price: Number(product.price) } : null;
    })
    .filter((item): item is { quantity: number; price: number } => item !== null);

  try {
    const options = await quoteShipping(cep, items);
    return NextResponse.json({ configured: true, options });
  } catch {
    // Melhor Envio fora do ar ou token inválido: o checkout segue só com a retirada
    return NextResponse.json({ configured: true, options: [], unavailable: true });
  }
}
