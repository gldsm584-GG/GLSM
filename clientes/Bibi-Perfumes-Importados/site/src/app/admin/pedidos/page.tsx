"use client";

import { useState } from "react";
import NewOrderModal from "@/components/admin/NewOrderModal";
import OrdersKanban from "@/components/admin/OrdersKanban";
import OrdersPanel from "@/components/admin/OrdersPanel";

export default function AdminPedidosPage() {
  const [view, setView] = useState<"quadro" | "lista">("quadro");
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Pedidos</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Acompanhe e atualize o status de cada venda fechada no WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex w-fit gap-1 rounded-full bg-neutral-100 p-1">
            {(["quadro", "lista"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  view === option
                    ? "bg-white text-brand shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                {option === "quadro" ? "Quadro" : "Lista"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowNewOrder(true)}
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            + Nova venda
          </button>
        </div>
      </div>

      <div className="mt-6">
        {view === "quadro" ? (
          <OrdersKanban key={`quadro-${refreshKey}`} />
        ) : (
          <OrdersPanel key={`lista-${refreshKey}`} />
        )}
      </div>

      {showNewOrder && (
        <NewOrderModal
          onClose={() => setShowNewOrder(false)}
          onCreated={() => {
            setShowNewOrder(false);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
