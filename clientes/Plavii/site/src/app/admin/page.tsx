"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getAllOrders,
  PAID_STATUSES,
  type OrderWithItems,
} from "@/lib/orders";
import { formatPrice, getAllProducts } from "@/lib/products";

const STATUS_STYLE: Record<string, string> = {
  pendente: "bg-amber-100 text-amber-700",
  confirmado: "bg-green-100 text-green-700",
  enviado: "bg-blue-100 text-blue-700",
  entregue: "bg-emerald-100 text-emerald-700",
  cancelado: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderWithItems[] | null>(null);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    getAllOrders().then(setOrders);
    getAllProducts().then((p) => setProductCount(p.length));
  }, []);

  if (!orders) return <p className="text-sm text-neutral-500">Carregando...</p>;

  const paid = orders.filter((o) => PAID_STATUSES.includes(o.status));
  const revenue = paid.reduce((sum, o) => sum + Number(o.total), 0);
  const pending = orders.filter((o) => o.status === "pendente").length;
  const customers = new Set(orders.map((o) => o.user_id)).size;

  const cards = [
    { label: "Receita confirmada", value: formatPrice(revenue), hint: `${paid.length} pedidos pagos` },
    { label: "Pedidos", value: String(orders.length), hint: `${pending} aguardando pagamento` },
    { label: "Produtos", value: String(productCount), hint: "no catálogo" },
    { label: "Clientes", value: String(customers), hint: "já fizeram pedido" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Resumo da loja.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-5">
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-800">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-neutral-400">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-800">Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="text-sm font-medium text-brand hover:underline">
            Ver todos
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-neutral-400">Nenhum pedido ainda.</p>
        ) : (
          <div className="flex flex-col divide-y divide-neutral-100">
            {orders.slice(0, 6).map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-neutral-800">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-neutral-400">
                    #{order.id.slice(0, 8)} ·{" "}
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      STATUS_STYLE[order.status] ?? "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="w-24 text-right font-semibold text-neutral-800">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
