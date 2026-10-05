import { Payment } from "mercadopago";
import { mpClient } from "./mercadopago";
import { supabaseAdmin } from "./supabase-admin";

const STATUS_MAP: Record<string, string> = {
  approved: "confirmado",
  pending: "pendente",
  in_process: "pendente",
  rejected: "cancelado",
  cancelled: "cancelado",
  refunded: "cancelado",
};

export async function syncPaymentStatus(paymentId: string) {
  const payment = new Payment(mpClient);
  const result = await payment.get({ id: paymentId });

  const orderId = result.external_reference;
  const mpStatus = result.status ?? "pending";
  const status = STATUS_MAP[mpStatus] ?? "pendente";

  if (!orderId) return null;

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw error;

  return { orderId, status };
}
