"use client";

import { useEffect, useState } from "react";
import { getAllOrders, PAID_STATUSES, type OrderWithItems } from "@/lib/orders";
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
  city: string;
  orders: number;
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
      existing.orders += 1;
      existing.spent += paid;
    } else {
      map.set(order.user_id, {
        userId: order.user_id,
        name: order.customer_name,
        phone: order.phone,
        city: order.city,
        orders: 1,
        spent: paid,
        lastOrder: order.created_at,
      });
    }
  }

  return [...map.values()];
}

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [emails, setEmails] = useState<Record<string, string>>({});

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
        <div className="overflow-x-auto rounded-xl bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Telefone</th>
                <th className="px-4 py-2">Cidade</th>
                <th className="px-4 py-2">Pedidos</th>
                <th className="px-4 py-2">Total pago</th>
                <th className="px-4 py-2">Último pedido</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.userId} className="border-t border-neutral-100">
                  <td className="px-4 py-2 font-medium text-neutral-800">{c.name}</td>
                  <td className="px-4 py-2 text-neutral-600">{emails[c.userId] ?? "—"}</td>
                  <td className="px-4 py-2 text-neutral-600">{c.phone}</td>
                  <td className="px-4 py-2 text-neutral-600">{c.city}</td>
                  <td className="px-4 py-2">{c.orders}</td>
                  <td className="px-4 py-2">{formatPrice(c.spent)}</td>
                  <td className="px-4 py-2 text-neutral-500">
                    {new Date(c.lastOrder).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
