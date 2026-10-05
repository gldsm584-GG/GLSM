import { supabase } from "./supabase";
import type { CartItem, Product } from "./types";

export type ShippingInfo = {
  customerName: string;
  address: string;
  city: string;
  cep: string;
  phone: string;
};

export async function createOrder(
  userId: string,
  items: CartItem[],
  products: Product[],
  shipping: ShippingInfo
) {
  const orderItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
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
      user_id: userId,
      total,
      customer_name: shipping.customerName,
      address: shipping.address,
      city: shipping.city,
      cep: shipping.cep,
      phone: shipping.phone,
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
  // Preenchidos pelo checkout depois da migração 020 (antes disso ficam vazios)
  delivery_method?: string | null; // 'pickup' | 'shipping'
  shipping_service?: string | null;
  shipping_cost?: number | null;
  shipping_days?: number | null;
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

export async function getOrder(orderId: string): Promise<OrderWithItems> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();
  if (error) throw error;
  return data as OrderWithItems;
}

async function orderRequest(orderId: string, method: "PATCH" | "DELETE") {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Entre na sua conta de novo pra continuar.");

  const response = await fetch(`/api/orders/${orderId}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "Não deu certo. Tenta de novo em instantes.");
  }
}

// Só pedido aguardando pagamento
export function cancelOrder(orderId: string) {
  return orderRequest(orderId, "PATCH");
}

// Só pedido aguardando pagamento ou cancelado — apaga de vez
export function deleteOrder(orderId: string) {
  return orderRequest(orderId, "DELETE");
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
