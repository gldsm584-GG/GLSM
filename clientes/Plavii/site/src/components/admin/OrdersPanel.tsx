"use client";

import { useEffect, useState } from "react";
import {
  getAllOrders,
  ORDER_STATUSES,
  updateOrderStatus,
  type OrderStatus,
  type OrderWithItems,
} from "@/lib/orders";
import { formatPrice } from "@/lib/products";

export default function OrdersPanel() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    await updateOrderStatus(orderId, status);
  };

  if (loading) return <p className="text-sm text-neutral-500">Carregando...</p>;

  if (orders.length === 0) {
    return <p className="text-sm text-neutral-400">Nenhum pedido ainda.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-xl border border-neutral-200 bg-white p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-neutral-800">
                #{order.id.slice(0, 8)} — {order.customer_name}
              </p>
              <p className="text-xs text-neutral-500">
                {new Date(order.created_at).toLocaleString("pt-BR")} ·{" "}
                {formatPrice(order.total)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(order.id, e.target.value as OrderStatus)
                }
                className="rounded-lg border border-neutral-200 px-2 py-1 text-sm outline-none focus:border-brand"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() =>
                  setExpanded(expanded === order.id ? null : order.id)
                }
                className="text-sm font-medium text-brand hover:underline"
              >
                {expanded === order.id ? "Ocultar" : "Ver detalhes"}
              </button>
            </div>
          </div>

          {expanded === order.id && (
            <div className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-600">
              <p className="mb-2 font-medium text-neutral-800">Itens</p>
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
              <p className="mt-3 font-medium text-neutral-800">Entrega</p>
              <p>{order.address}</p>
              <p>
                {order.city} — CEP {order.cep}
              </p>
              <p>{order.phone}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
