"use client";

import Image from "next/image";
import Link from "next/link";
import LineIcon from "@/components/LineIcon";
import { userDisplay } from "@/components/UserMenu";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import { buildCartWhatsappUrl } from "@/lib/whatsapp";

export default function CarrinhoPage() {
  const { items, products, setQuantity, removeItem, totalPrice } = useCart();
  const { user } = useAuth();
  // O nome na mensagem do WhatsApp vem só do cadastro (conta logada). Sem
  // cadastro, a mensagem sai sem nome. userDisplay cai pro email quando a
  // conta não tem nome — nesse caso também não manda nome.
  const account = user ? userDisplay(user.user_metadata, user.email) : null;
  const customerName = account?.nome ? account.full : "";

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
          <LineIcon name="cart" className="h-10 w-10" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-neutral-800">
          Seu carrinho está vazio
        </h1>
        <p className="mt-2 text-neutral-500">
          Adicione produtos pra ver eles aqui.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Continuar comprando
        </Link>
      </div>
    );
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 flex items-baseline gap-3 text-3xl font-extrabold tracking-tight text-neutral-800">
        Seu carrinho
        <span className="text-base font-medium text-neutral-400">
          {totalItems} {totalItems === 1 ? "item" : "itens"}
        </span>
      </h1>

      <div className="grid items-start gap-6 md:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;

            return (
              <div
                key={item.productId}
                className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </div>

                <div className="min-w-0 flex-1 basis-40">
                  <Link
                    href={`/produto/${product.slug}`}
                    className="line-clamp-2 font-semibold text-neutral-800 hover:text-brand"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-neutral-500">
                    {formatPrice(product.price)} un.
                  </p>
                </div>

                <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white hover:text-brand"
                    aria-label="Diminuir quantidade"
                  >
                    <LineIcon name="minus" className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white hover:text-brand"
                    aria-label="Aumentar quantidade"
                  >
                    <LineIcon name="plus" className="h-4 w-4" />
                  </button>
                </div>

                <span className="w-24 text-right text-lg font-extrabold text-neutral-800">
                  {formatPrice(product.price * item.quantity)}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remover ${product.name} do carrinho`}
                  title="Remover do carrinho"
                >
                  <LineIcon name="trash" className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>

        <aside className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:sticky md:top-32">
          <h2 className="text-lg font-bold text-neutral-800">Resumo</h2>

          <div className="flex justify-between text-sm text-neutral-600">
            <span>
              Produtos ({totalItems})
            </span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <p className="flex items-center gap-2 rounded-lg bg-brand/10 px-3 py-2 text-xs font-medium text-brand">
            <LineIcon name="truck" className="h-4 w-4" />
            Frete grátis a partir de R$14,99
          </p>

          <div className="flex items-baseline justify-between border-t border-neutral-100 pt-4">
            <span className="font-bold text-neutral-800">Total</span>
            <span className="text-3xl font-extrabold tracking-tight text-brand">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <a
            href={buildCartWhatsappUrl(items, products, totalPrice, customerName)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-center text-lg font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            <LineIcon name="phone" className="h-5 w-5" />
            Finalizar no WhatsApp
          </a>
          <Link
            href="/"
            className="text-center text-sm font-medium text-neutral-500 transition-colors hover:text-brand"
          >
            Continuar comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
