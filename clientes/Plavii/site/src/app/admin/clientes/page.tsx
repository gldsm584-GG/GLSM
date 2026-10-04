"use client";

import { Fragment, useEffect, useState } from "react";
import { getAllOrders, type OrderWithItems } from "@/lib/orders";
import { formatOrderDate, statusStyle } from "@/lib/order-status";
import { formatPrice } from "@/lib/products";
import { paidAmount } from "@/lib/stats";
import { supabase } from "@/lib/supabase";
import type { AdminUser } from "@/app/api/admin/customers/route";

async function fetchAccounts(): Promise<AdminUser[]> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new Error(
      "Essa aba não está mais logada. Saia e entre de novo como admin pra ver as contas cadastradas."
    );
  }

  const response = await fetch("/api/admin/customers", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "Essa aba não está mais logada como admin — provavelmente porque entrou ou criou uma conta de cliente nela (só cabe uma sessão por navegador). Saia e entre de novo como gustest@gmail.com pra ver as contas cadastradas."
      );
    }
    throw new Error("Não deu pra carregar as contas cadastradas. Tenta de novo em instantes.");
  }
  return (await response.json()).users;
}

type Customer = {
  // userId quando é conta de verdade — telefone só serve pra juntar pedido
  // manual (sem conta) numa conta existente. Nunca funde duas CONTAS só
  // porque o telefone bate (ex: teste reusando o telefone de outra conta) —
  // cada conta sempre vira a própria linha
  key: string;
  userId: string | null;
  email: string | null;
  name: string;
  phone: string;
  address: string | null;
  city: string | null;
  cep: string | null;
  orders: OrderWithItems[];
  spent: number;
  lastOrder: string | null;
  signedUpAt: string | null;
};

function buildCustomers(orders: OrderWithItems[], accounts: AdminUser[]): Customer[] {
  const map = new Map<string, Customer>();
  const phoneToUserId = new Map<string, string>();

  // Toda conta cadastrada vira a própria linha, por id — garante que duas
  // contas diferentes nunca se misturam numa só
  for (const account of accounts) {
    const name = `${account.nome} ${account.sobrenome}`.trim() || account.email;
    map.set(account.id, {
      key: account.id,
      userId: account.id,
      email: account.email,
      name,
      phone: account.telefone || "—",
      address: account.rua ? `${account.rua} ${account.numero}, ${account.bairro}` : null,
      city: account.cidade || null,
      cep: account.cep || null,
      orders: [],
      spent: 0,
      lastOrder: null,
      signedUpAt: account.createdAt,
    });
    if (account.telefone) phoneToUserId.set(account.telefone, account.id);
  }

  // Pedido com conta entra na linha da conta; pedido manual (sem conta) junta
  // com a conta de telefone igual quando existir, senão vira linha própria
  // pelo telefone. Pedidos vêm do mais novo pro mais antigo, então o
  // primeiro pedido que cada linha recebe aqui é sempre o mais recente dela
  for (const order of orders) {
    const paid = paidAmount(order);
    const ownerKey = order.user_id ?? phoneToUserId.get(order.phone) ?? order.phone;
    const existing = map.get(ownerKey);
    if (existing) {
      existing.orders.push(order);
      existing.spent += paid;
      if (!existing.lastOrder) existing.lastOrder = order.created_at;
      if (!existing.address && order.address) {
        existing.address = order.address;
        existing.city = order.city;
        existing.cep = order.cep;
      }
    } else {
      map.set(ownerKey, {
        key: ownerKey,
        userId: order.user_id,
        email: null,
        name: order.customer_name,
        phone: order.phone,
        address: order.address,
        city: order.city,
        cep: order.cep,
        orders: [order],
        spent: paid,
        lastOrder: order.created_at,
        signedUpAt: null,
      });
    }
  }

  // Mais recente primeiro — último pedido, ou data de cadastro pra quem não comprou ainda
  return [...map.values()].sort((a, b) => {
    const da = a.lastOrder ?? a.signedUpAt ?? "";
    const db = b.lastOrder ?? b.signedUpAt ?? "";
    return db.localeCompare(da);
  });
}

// Lista dos produtos pedidos por esse cliente, um pedido por bloco
function CustomerOrders({ orders }: { orders: OrderWithItems[] }) {
  if (orders.length === 0) {
    return <p className="text-sm text-neutral-400">Cadastrou a conta, ainda não comprou.</p>;
  }
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

function Location({ city, address, cep }: { city: string | null; address: string | null; cep: string | null }) {
  if (!city && !address) {
    return <p className="text-xs text-neutral-400">Sem endereço</p>;
  }
  return (
    <>
      {city && <p>{city}</p>}
      {address && (
        <p className="text-xs text-neutral-400">
          {address}
          {cep && ` — CEP ${cep}`}
        </p>
      )}
    </>
  );
}

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getAllOrders().then((orders) => {
      fetchAccounts()
        .then((accounts) => {
          setAccountsError(null);
          setCustomers(buildCustomers(orders, accounts));
        })
        .catch((err) => {
          // Pedidos (com ou sem conta) ainda aparecem — só as contas sem
          // pedido ficam de fora enquanto essa aba não voltar a ser admin
          setAccountsError(
            err instanceof Error ? err.message : "Não deu pra carregar as contas cadastradas."
          );
          setCustomers(buildCustomers(orders, []));
        });
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800">Clientes</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-500">
        Quem já comprou (inclusive venda manual) ou criou conta no site.
      </p>

      {accountsError && (
        <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{accountsError}</p>
      )}

      {!customers ? (
        <p className="text-sm text-neutral-500">Carregando...</p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-neutral-400">Nenhum cliente ainda.</p>
      ) : (
        <>
          {/* Celular: cartão por cliente, sem precisar arrastar pro lado */}
          <div className="flex flex-col gap-3 md:hidden">
            {customers.map((c) => (
              <div key={c.key} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate font-medium text-neutral-800">{c.name}</p>
                  <p className="shrink-0 font-semibold text-neutral-800">{formatPrice(c.spent)}</p>
                </div>
                <p className="mt-1 truncate text-sm text-neutral-500">{c.email ?? "—"}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
                  <span>{c.phone}</span>
                </div>
                <div className="mt-1">
                  <Location city={c.city} address={c.address} cep={c.cep} />
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-2 text-xs text-neutral-400">
                  <span>
                    {c.orders.length > 0
                      ? `${c.orders.length} pedido${c.orders.length === 1 ? "" : "s"}`
                      : "Sem pedido"}
                  </span>
                  <span>
                    {c.lastOrder
                      ? `Último em ${new Date(c.lastOrder).toLocaleDateString("pt-BR")}`
                      : c.signedUpAt
                        ? `Cadastrou em ${new Date(c.signedUpAt).toLocaleDateString("pt-BR")}`
                        : ""}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === c.key ? null : c.key)}
                  className="mt-2 w-full rounded-md bg-brand/10 py-2 text-sm font-semibold text-brand hover:bg-brand/20"
                >
                  {expanded === c.key ? "Ocultar" : "Ver detalhes"}
                </button>
                {expanded === c.key && (
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
                  <th className="px-4 py-2">Última atividade</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <Fragment key={c.key}>
                    <tr className="border-t border-neutral-100">
                      <td className="px-4 py-2 font-medium text-neutral-800">{c.name}</td>
                      <td className="px-4 py-2 text-neutral-600">{c.email ?? "—"}</td>
                      <td className="px-4 py-2 text-neutral-600">{c.phone}</td>
                      <td className="px-4 py-2 text-neutral-600">
                        <Location city={c.city} address={c.address} cep={c.cep} />
                      </td>
                      <td className="px-4 py-2">{c.orders.length}</td>
                      <td className="px-4 py-2">{formatPrice(c.spent)}</td>
                      <td className="px-4 py-2 text-neutral-500">
                        {c.lastOrder
                          ? new Date(c.lastOrder).toLocaleDateString("pt-BR")
                          : c.signedUpAt
                            ? `Cadastro: ${new Date(c.signedUpAt).toLocaleDateString("pt-BR")}`
                            : "—"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => setExpanded(expanded === c.key ? null : c.key)}
                          className="font-medium text-brand hover:underline"
                        >
                          {expanded === c.key ? "Ocultar" : "Ver detalhes"}
                        </button>
                      </td>
                    </tr>
                    {expanded === c.key && (
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
