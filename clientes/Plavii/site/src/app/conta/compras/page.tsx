"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LineIcon from "@/components/LineIcon";
import { useAuth } from "@/lib/auth-context";
import { getMyOrders, type OrderWithItems } from "@/lib/orders";
import { formatOrderDate, statusStyle } from "@/lib/order-status";
import { formatPrice } from "@/lib/products";

export default function ComprasPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[] | null>(null);
  const [error, setError] = useState(false);

  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    getMyOrders(userId)
      .then(setOrders)
      .catch(() => setError(true));
  }, [userId]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-800">Compras</h1>

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          Não deu pra carregar suas compras. Tenta de novo em instantes.
        </p>
      )}

      {!error && orders === null && (
        <div className="flex flex-col gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white ring-1 ring-black/5" />
          ))}
        </div>
      )}

      {orders && orders.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
          <LineIcon name="bag" className="mx-auto h-12 w-12 text-neutral-300" />
          <p className="mt-4 text-lg font-bold text-neutral-800">Você ainda não fez compras</p>
          <p className="mt-1 text-neutral-500">Quando finalizar um pedido, ele aparece aqui.</p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Ver produtos
          </Link>
        </div>
      )}

      {orders?.map((order) => {
        const status = statusStyle(order.status);
        return (
          <div
            key={order.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 bg-neutral-50 px-5 py-3">
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  {formatOrderDate(order.created_at)}
                </p>
                <p className="text-xs text-neutral-400">
                  Pedido #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>
                {status.label}
              </span>
            </div>

            <ul className="divide-y divide-neutral-100 px-5">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="text-neutral-700">
                    {item.product_name}
                    <span className="text-neutral-400"> × {item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-medium text-neutral-800">
                    {formatPrice(item.unit_price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 px-5 py-3">
              <p className="text-sm text-neutral-500">
                Total <span className="text-lg font-extrabold text-brand">{formatPrice(order.total)}</span>
              </p>
              <Link
                href={`/pedido/${order.id}`}
                className="rounded-md bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/20"
              >
                Ver detalhes
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
