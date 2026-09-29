import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
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

  const { orderId } = await request.json();

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

  const origin = new URL(request.url).origin;
  const isLocalhost = origin.includes("localhost") || origin.includes("127.0.0.1");

  const preference = new Preference(mpClient);

  const result = await preference.create({
    body: {
      items: order.order_items.map(
        (item: { product_name: string; unit_price: number; quantity: number }) => ({
          title: item.product_name,
          quantity: item.quantity,
          unit_price: Number(item.unit_price),
          currency_id: "BRL",
        })
      ),
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
