"use client";

import Link from "next/link";
import { useState } from "react";
import type { OrderWithItems } from "@/lib/orders";
import { formatOrderDate, statusStyle } from "@/lib/order-status";
import { formatPrice } from "@/lib/products";

const PAGE_SIZE = 10;

// Extraída da lista fixa em 6 itens que já existia no Dashboard — agora com
// paginação de verdade e o selo de status oficial (src/lib/order-status.ts)
// em vez do texto cru ("pendente") que o Dashboard mostrava antes.
export default function RecentOrdersTable({ orders }: { orders: OrderWithItems[] }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageOrders = orders.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="rounded-2xl bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-neutral-800">Pedidos no período</h2>
        <Link href="/admin/pedidos" className="text-sm font-medium text-brand hover:underline">
          Ver todos
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-neutral-400">Nenhum pedido nesse período.</p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-neutral-100">
            {pageOrders.map((order) => {
              const style = statusStyle(order.status);
              return (
                <div key={order.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-neutral-800">{order.customer_name}</p>
                    <p className="text-xs text-neutral-400">
                      #{order.id.slice(0, 8)} · {formatOrderDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style.className}`}>
                      {style.label}
                    </span>
                    <span className="w-24 text-right font-semibold text-neutral-800">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {pageCount > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="rounded-lg px-3 py-1.5 font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Anterior
              </button>
              <span className="text-xs text-neutral-400">
                Página {currentPage + 1} de {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={currentPage >= pageCount - 1}
                className="rounded-lg px-3 py-1.5 font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
