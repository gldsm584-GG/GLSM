"use client";

import { Fragment, useEffect, useState } from "react";
import { getAllOrders, PAID_STATUSES, type OrderWithItems } from "@/lib/orders";
import { formatOrderDate, statusStyle } from "@/lib/order-status";
import { formatPrice } from "@/lib/products";
import { supabase } from "@/lib/supabase";

async function fetchEmails(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return {};

  const response = await fetch("/api/admin/emails", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return {};
  return (await response.json()).emails;
}

type Customer = {
  userId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  cep: string;
  orders: OrderWithItems[];
  spent: number;
  lastOrder: string;
};

function groupCustomers(orders: OrderWithItems[]): Customer[] {
  const map = new Map<string, Customer>();

  // pedidos vêm do mais novo pro mais antigo: o primeiro de cada cliente é o mais recente
  for (const order of orders) {
    const paid = PAID_STATUSES.includes(order.status) ? Number(order.total) : 0;
    const existing = map.get(order.user_id);
    if (existing) {
      existing.orders.push(order);
      existing.spent += paid;
    } else {
      map.set(order.user_id, {
        userId: order.user_id,
        name: order.customer_name,
        phone: order.phone,
        address: order.address,
        city: order.city,
        cep: order.cep,
        orders: [order],
        spent: paid,
        lastOrder: order.created_at,
      });
    }
  }

  return [...map.values()];
}

// Lista dos produtos pedidos por esse cliente, um pedido por bloco
function CustomerOrders({ orders }: { orders: OrderWithItems[] }) {
  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => {
        const status = statusStyle(order.status);
        return (
          <div key={order.id} className="rounded-lg bg-neutral-50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-neutral-500">
                {formatOrderDate(order.created_at)} · #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${status.className}`}>
                {status.label}
              </span>
            </div>
            <ul className="mt-2 flex flex-col gap-1">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-sm">
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
          </div>
        );
      })}
    </div>
  );
}

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getAllOrders().then((orders) => setCustomers(groupCustomers(orders)));
    fetchEmails().then(setEmails);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800">Clientes</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-500">
        Quem já fez pelo menos um pedido na loja.
      </p>

      {!customers ? (
        <p className="text-sm text-neutral-500">Carregando...</p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-neutral-400">Nenhum cliente ainda.</p>
      ) : (
        <>
          {/* Celular: cartão por cliente, sem precisar arrastar pro lado */}
          <div className="flex flex-col gap-3 md:hidden">
            {customers.map((c) => (
              <div key={c.userId} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate font-medium text-neutral-800">{c.name}</p>
                  <p className="shrink-0 font-semibold text-neutral-800">{formatPrice(c.spent)}</p>
                </div>
                <p className="mt-1 truncate text-sm text-neutral-500">{emails[c.userId] ?? "—"}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
                  <span>{c.phone}</span>
                  <span>{c.city}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  {c.address} — CEP {c.cep}
                </p>
                <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-2 text-xs text-neutral-400">
                  <span>
                    {c.orders.length} pedido{c.orders.length === 1 ? "" : "s"}
                  </span>
                  <span>Último em {new Date(c.lastOrder).toLocaleDateString("pt-BR")}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === c.userId ? null : c.userId)}
                  className="mt-2 w-full rounded-md bg-brand/10 py-2 text-sm font-semibold text-brand hover:bg-brand/20"
                >
                  {expanded === c.userId ? "Ocultar" : "Ver detalhes"}
                </button>
                {expanded === c.userId && (
                  <div className="mt-3 border-t border-neutral-100 pt-3">
                    <CustomerOrders orders={c.orders} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: tabela */}
          <div className="hidden overflow-x-auto rounded-xl bg-white md:block">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-neutral-50 text-left text-neutral-500">
                <tr>
                  <th className="px-4 py-2">Cliente</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Telefone</th>
                  <th className="px-4 py-2">Localização</th>
                  <th className="px-4 py-2">Pedidos</th>
                  <th className="px-4 py-2">Total pago</th>
                  <th className="px-4 py-2">Último pedido</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <Fragment key={c.userId}>
                    <tr className="border-t border-neutral-100">
                      <td className="px-4 py-2 font-medium text-neutral-800">{c.name}</td>
                      <td className="px-4 py-2 text-neutral-600">{emails[c.userId] ?? "—"}</td>
                      <td className="px-4 py-2 text-neutral-600">{c.phone}</td>
                      <td className="px-4 py-2 text-neutral-600">
                        <p>{c.city}</p>
                        <p className="text-xs text-neutral-400">
                          {c.address} — CEP {c.cep}
                        </p>
                      </td>
                      <td className="px-4 py-2">{c.orders.length}</td>
                      <td className="px-4 py-2">{formatPrice(c.spent)}</td>
                      <td className="px-4 py-2 text-neutral-500">
                        {new Date(c.lastOrder).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => setExpanded(expanded === c.userId ? null : c.userId)}
                          className="font-medium text-brand hover:underline"
                        >
                          {expanded === c.userId ? "Ocultar" : "Ver detalhes"}
                        </button>
                      </td>
                    </tr>
                    {expanded === c.userId && (
                      <tr className="border-t border-neutral-100 bg-neutral-50/50">
                        <td colSpan={8} className="px-4 py-3">
                          <CustomerOrders orders={c.orders} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
