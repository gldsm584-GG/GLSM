import { NextResponse } from "next/server";
import { syncPaymentStatus } from "@/lib/payment-status";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const paymentId = body?.data?.id;

  if (!paymentId) {
    return NextResponse.json({ ok: true });
  }

  try {
    await syncPaymentStatus(String(paymentId));
  } catch {
    // Mercado Pago reenvia a notificação automaticamente se falhar
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
