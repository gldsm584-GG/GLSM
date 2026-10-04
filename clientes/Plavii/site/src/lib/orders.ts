import { supabase } from "./supabase";
import type { Product } from "./types";

export const PAID_STATUSES = ["confirmado", "enviado", "entregue"];

export type OrderWithItems = {
  id: string;
  user_id: string | null;
  status: string;
  total: number;
  customer_name: string;
  address: string | null;
  city: string | null;
  cep: string | null;
  phone: string;
  created_at: string;
  order_items: {
    id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
  }[];
};

export async function getMyOrders(userId: string): Promise<OrderWithItems[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as OrderWithItems[];
}

export const ORDER_STATUSES = [
  "pendente",
  "confirmado",
  "enviado",
  "entregue",
  "cancelado",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export async function getAllOrders(): Promise<OrderWithItems[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as OrderWithItems[];
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) throw error;
}

// Lançada pelo admin depois de fechar a venda no WhatsApp — sem conta de
// cliente (user_id null) e sem endereço (entrega combinada por fora).
export async function createManualOrder(input: {
  customerName: string;
  phone: string;
  status: OrderStatus;
  items: { productId: string; quantity: number }[];
  products: Product[];
}): Promise<{ id: string }> {
  const orderItems = input.items
    .map((item) => {
      const product = input.products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: item.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const total = orderItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: null,
      status: input.status,
      total,
      customer_name: input.customerName,
      phone: input.phone,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) throw itemsError;

  return order as { id: string };
}
