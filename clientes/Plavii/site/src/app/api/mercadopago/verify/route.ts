import { NextResponse } from "next/server";
import { syncPaymentStatus } from "@/lib/payment-status";

export async function GET(request: Request) {
  const paymentId = new URL(request.url).searchParams.get("payment_id");

  if (!paymentId) {
    return NextResponse.json({ error: "payment_id é obrigatório" }, { status: 400 });
  }

  try {
    const result = await syncPaymentStatus(paymentId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Falha ao verificar pagamento" }, { status: 500 });
  }
}
