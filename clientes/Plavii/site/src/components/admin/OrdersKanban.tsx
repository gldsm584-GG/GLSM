"use client";

import { useEffect, useState } from "react";
import {
  getAllOrders,
  ORDER_STATUSES,
  updateOrderStatus,
  type OrderStatus,
  type OrderWithItems,
} from "@/lib/orders";
import { STATUS_STYLE } from "@/lib/order-status";
import { STATUS_CHART_COLORS } from "@/lib/chart-colors";
import { formatPrice } from "@/lib/products";

export default function OrdersKanban() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const handleDrop = (status: OrderStatus) => {
    setDragOverStatus(null);
    const order = orders.find((o) => o.id === draggingId);
    setDraggingId(null);
    if (!order || order.status === status) return;

    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    updateOrderStatus(order.id, status);
  };

  if (loading) return <p className="text-sm text-neutral-500">Carregando...</p>;

  if (orders.length === 0) {
    return <p className="text-sm text-neutral-400">Nenhum pedido ainda.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {ORDER_STATUSES.map((status) => {
        const color = STATUS_CHART_COLORS[status];
        const columnOrders = orders.filter((o) => o.status === status);
        const isOver = dragOverStatus === status;

        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragOverStatus !== status) setDragOverStatus(status);
            }}
            onDragLeave={() => setDragOverStatus((s) => (s === status ? null : s))}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(status);
            }}
            className="min-w-0 rounded-xl bg-white p-1.5 transition-shadow"
            style={{ boxShadow: isOver ? `0 0 0 2px ${color}` : "0 0 0 1px #e5e5e5" }}
          >
            <div className="flex items-center justify-between gap-1 px-0.5 pb-1.5">
              <span
                className="truncate rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                style={{ background: color }}
                title={STATUS_STYLE[status].label}
              >
                {STATUS_STYLE[status].label}
              </span>
              <span className="shrink-0 text-xs font-semibold text-neutral-400">
                {columnOrders.length}
              </span>
            </div>

            <div className="flex min-h-[64px] flex-col gap-1.5">
              {columnOrders.map((order) => (
                <div
                  key={order.id}
                  draggable
                  onDragStart={() => setDraggingId(order.id)}
                  onDragEnd={() => setDraggingId(null)}
                  className={`cursor-grab rounded-lg border border-neutral-200 bg-neutral-50 p-2 active:cursor-grabbing hover:shadow-sm ${
                    draggingId === order.id ? "opacity-40" : ""
                  }`}
                >
                  <p className="truncate text-xs font-medium text-neutral-800">{order.customer_name}</p>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>{new Date(order.created_at).toLocaleDateString("pt-BR")}</span>
                    <span className="font-semibold text-neutral-700">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
              {columnOrders.length === 0 && (
                <p className="py-3 text-center text-[11px] text-neutral-300">Arraste aqui</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
