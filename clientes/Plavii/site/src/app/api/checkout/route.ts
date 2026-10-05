import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { quoteShipping } from "@/lib/shipping";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: caller } = await supabaseAdmin.auth.getUser(token);
  if (!caller.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { orderId, delivery } = await request.json();

  if (!orderId) {
    return NextResponse.json({ error: "orderId é obrigatório" }, { status: 400 });
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .eq("user_id", caller.user.id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  type OrderItemRow = { product_name: string; unit_price: number; quantity: number };
  const orderItems: OrderItemRow[] = order.order_items;
  const itemsTotal = orderItems.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0);

  // Entrega: retirada na loja (grátis) ou frete do Melhor Envio. O valor do
  // frete é cotado de novo aqui no servidor — nunca vem do navegador.
  let shipping: { name: string; company: string; cost: number; days: number | null } | null = null;
  let deliveryMethod: "pickup" | "shipping" | null = null;

  if (delivery?.method === "pickup") {
    deliveryMethod = "pickup";
  } else if (delivery?.method === "shipping") {
    deliveryMethod = "shipping";
    let options: Awaited<ReturnType<typeof quoteShipping>> = [];
    try {
      options = await quoteShipping(
        order.cep ?? "",
        orderItems.map((item) => ({ quantity: item.quantity, price: Number(item.unit_price) }))
      );
    } catch (error) {
      console.error("[frete] cotação no checkout falhou:", error instanceof Error ? error.message : error);
      options = [];
    }
    const chosen = options.find((option) => option.id === delivery.serviceId);
    if (!chosen) {
      return NextResponse.json(
        { error: "Esse frete não está mais disponível. Escolha a entrega de novo." },
        { status: 409 }
      );
    }
    shipping = { name: chosen.name, company: chosen.company, cost: chosen.price, days: chosen.days };
  }

  if (deliveryMethod) {
    const total = itemsTotal + (shipping?.cost ?? 0);
    const details = {
      total,
      delivery_method: deliveryMethod,
      shipping_service: shipping ? [shipping.company, shipping.name].filter(Boolean).join(" ") : null,
      shipping_cost: shipping?.cost ?? 0,
      shipping_days: shipping?.days ?? null,
    };
    const { error: updateError } = await supabaseAdmin.from("orders").update(details).eq("id", order.id);
    if (updateError) {
      // Colunas de frete ainda não criadas (migração 020): grava só o total, pro pagamento sair certo
      await supabaseAdmin.from("orders").update({ total }).eq("id", order.id);
    }
  }

  const origin = new URL(request.url).origin;
  const isLocalhost = origin.includes("localhost") || origin.includes("127.0.0.1");

  const preference = new Preference(mpClient);

  const result = await preference.create({
    body: {
      items: [
        ...orderItems.map((item, index) => ({
          id: String(index + 1),
          title: item.product_name,
          quantity: item.quantity,
          unit_price: Number(item.unit_price),
          currency_id: "BRL",
        })),
        ...(shipping && shipping.cost > 0
          ? [
              {
                id: "frete",
                title: `Frete — ${[shipping.company, shipping.name].filter(Boolean).join(" ")}`,
                quantity: 1,
                unit_price: shipping.cost,
                currency_id: "BRL",
              },
            ]
          : []),
      ],
      payer: { name: order.customer_name },
      external_reference: order.id,
      back_urls: {
        success: `${origin}/pedido/${order.id}`,
        pending: `${origin}/pedido/${order.id}`,
        failure: `${origin}/pedido/${order.id}`,
      },
      // auto_return exige um domínio público — não funciona com localhost
      ...(isLocalhost ? {} : { auto_return: "approved" as const }),
      notification_url: `${origin}/api/mercadopago/webhook`,
    },
  });

  return NextResponse.json({ initPoint: result.init_point });
}
