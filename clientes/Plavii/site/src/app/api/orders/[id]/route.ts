import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Context = { params: Promise<{ id: string }> };

async function getCaller(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data } = await supabaseAdmin.auth.getUser(token);
  return data.user;
}

// Cancelar: só pedido "pendente" (aguardando pagamento) do próprio cliente
export async function PATCH(request: Request, { params }: Context) {
  const user = await getCaller(request);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status: "cancelado" })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "pendente")
    .select("id");

  if (error) {
    return NextResponse.json({ error: "Falha ao cancelar o pedido" }, { status: 500 });
  }
  if (!data?.length) {
    return NextResponse.json(
      { error: "Esse pedido não pode mais ser cancelado." },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}

// Apagar: só pedido "pendente" ou "cancelado" do próprio cliente. Não desfaz.
export async function DELETE(request: Request, { params }: Context) {
  const user = await getCaller(request);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;

  // Não apaga se o Mercado Pago já aprovou um pagamento pra esse pedido —
  // senão o dinheiro entra e o pedido some
  try {
    const payments = await new Payment(mpClient).search({
      options: { external_reference: id },
    });
    if (payments.results?.some((payment) => payment.status === "approved")) {
      return NextResponse.json(
        { error: "Esse pedido tem um pagamento aprovado e não pode ser apagado." },
        { status: 409 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Não deu pra confirmar o pagamento agora. Tenta de novo em instantes." },
      { status: 502 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .in("status", ["pendente", "cancelado"])
    .select("id");

  if (error) {
    return NextResponse.json({ error: "Falha ao apagar o pedido" }, { status: 500 });
  }
  if (!data?.length) {
    return NextResponse.json(
      { error: "Esse pedido não pode ser apagado." },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
