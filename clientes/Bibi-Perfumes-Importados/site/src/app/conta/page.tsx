"use client";

import Link from "next/link";
import LineIcon, { type IconName } from "@/components/LineIcon";
import { userDisplay } from "@/components/UserMenu";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";
import { useFavorites, useHistory } from "@/lib/personal";
import { addressText, profileFromMeta } from "@/lib/profile";

const tileClass =
  "flex items-start gap-4 rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md";

function Tile({ href, icon, title, text }: { href: string; icon: IconName; title: string; text: string }) {
  return (
    <Link href={href} className={tileClass}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
        <LineIcon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-bold text-neutral-800">{title}</span>
        <span className="block text-sm text-neutral-500">{text}</span>
      </span>
    </Link>
  );
}

export default function ContaPage() {
  const { user } = useAuth();
  const history = useHistory();
  const favorites = useFavorites();

  if (!user) return null;
  const { nome, full } = userDisplay(user);
  const address = addressText(profileFromMeta(user.user_metadata));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-dark">Olá, {nome || full}</h1>
        <p className="text-neutral-500">Seus favoritos, perfumes vistos e dados de entrega.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Tile
          href="/conta/historico"
          icon="clock"
          title="Histórico"
          text={
            history.length === 0
              ? "Perfumes que você viu aparecem aqui"
              : `${history.length} ${history.length === 1 ? "perfume visto" : "perfumes vistos"}`
          }
        />
        <Tile
          href="/conta/favoritos"
          icon="heart"
          title="Favoritos"
          text={
            favorites.length === 0
              ? "Toque no coração pra guardar perfumes"
              : `${favorites.length} ${favorites.length === 1 ? "favorito" : "favoritos"}`
          }
        />
        <Tile
          href="/conta/dados#endereco"
          icon="pin"
          title="Endereço"
          text={address || "Adicionar endereço de entrega"}
        />
        <Tile href="/conta/dados" icon="user" title="Meus dados" text="Nome, endereço e senha" />
        {isAdmin(user) && (
          <Tile
            href="/admin"
            icon="shield"
            title="Painel do administrador"
            text="Produtos e pedidos da loja"
          />
        )}
      </div>
    </div>
  );
}
