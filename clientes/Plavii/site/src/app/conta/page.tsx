"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LineIcon, { type IconName } from "@/components/LineIcon";
import { userDisplay } from "@/components/UserMenu";
import { useAddresses } from "@/lib/address-context";
import { addressHeaderLabel } from "@/lib/addresses";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";
import { getMyOrders, type OrderWithItems } from "@/lib/orders";
import { formatOrderDate, statusStyle } from "@/lib/order-status";
import { useFavorites, useHistory } from "@/lib/personal";
import { formatPrice } from "@/lib/products";

const tileClass =
  "flex items-start gap-4 rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md";

function Tile({
  icon,
  title,
  text,
}: {
  icon: IconName;
  title: string;
  text: string;
}) {
  return (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
        <LineIcon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-bold text-neutral-800">{title}</span>
        <span className="block text-sm text-neutral-500">{text}</span>
      </span>
    </>
  );
}

export default function ContaPage() {
  const { user } = useAuth();
  const { selected, openPicker } = useAddresses();
  const history = useHistory();
  const favorites = useFavorites();
  const [orders, setOrders] = useState<OrderWithItems[] | null>(null);

  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    getMyOrders(userId)
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [userId]);

  if (!user) return null;
  const { nome, full } = userDisplay(user.user_metadata, user.email);
  const last = orders?.[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-800">
          Olá, {nome || full}
        </h1>
        <p className="text-neutral-500">Acompanhe seus pedidos e gerencie sua conta.</p>
      </div>

      {last && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Última compra
            </p>
            <p className="font-bold text-neutral-800">
              {last.order_items[0]?.product_name}
              {last.order_items.length > 1 && ` + ${last.order_items.length - 1}`}
            </p>
            <p className="text-sm text-neutral-500">{formatOrderDate(last.created_at)}</p>
          </div>
          <div className="text-right">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(last.status).className}`}
            >
              {statusStyle(last.status).label}
            </span>
            <p className="mt-1 font-extrabold text-brand">{formatPrice(last.total)}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/conta/compras" className={tileClass}>
          <Tile
            icon="bag"
            title="Compras"
            text={
              orders === null
                ? "Carregando…"
                : orders.length === 0
                  ? "Você ainda não fez compras"
                  : `${orders.length} ${orders.length === 1 ? "pedido" : "pedidos"}`
            }
          />
        </Link>
        <Link href="/conta/historico" className={tileClass}>
          <Tile
            icon="clock"
            title="Histórico"
            text={
              history.length === 0
                ? "Produtos que você viu aparecem aqui"
                : `${history.length} ${history.length === 1 ? "produto visto" : "produtos vistos"}`
            }
          />
        </Link>
        <Link href="/conta/favoritos" className={tileClass}>
          <Tile
            icon="heart"
            title="Favoritos"
            text={
              favorites.length === 0
                ? "Toque no coração pra guardar produtos"
                : `${favorites.length} ${favorites.length === 1 ? "favorito" : "favoritos"}`
            }
          />
        </Link>
        <button type="button" onClick={openPicker} className={tileClass}>
          <Tile
            icon="pin"
            title="Endereços"
            text={selected ? addressHeaderLabel(selected) : "Adicionar endereço de entrega"}
          />
        </button>
        <Link href="/conta/dados" className={tileClass}>
          <Tile icon="user" title="Meus dados" text="Nome, telefones e senha" />
        </Link>
        {isAdmin(user) && (
          <Link href="/admin" className={tileClass}>
            <Tile icon="shield" title="Painel do administrador" text="Produtos, pedidos e clientes" />
          </Link>
        )}
      </div>
    </div>
  );
}
