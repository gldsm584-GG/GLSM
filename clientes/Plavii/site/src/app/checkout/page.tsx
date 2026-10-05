"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import AddressForm from "@/components/AddressForm";
import LineIcon from "@/components/LineIcon";
import { addressLine, addressSecondLine, orderAddressFields, type Address } from "@/lib/addresses";
import { useAddresses } from "@/lib/address-context";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { formatPhone } from "@/lib/profile";
import type { ShippingOption } from "@/lib/shipping";
import { supabase } from "@/lib/supabase";
import { buildCartWhatsappUrl } from "@/lib/whatsapp";

const inputClass =
  "rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand";

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, products, totalPrice, clear } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  const { selected, saveAddress, openPicker } = useAddresses();
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Entrega: retirada na loja (grátis) ou frete cotado no Melhor Envio pelo CEP
  const [deliveryId, setDeliveryId] = useState("pickup");
  const [quote, setQuote] = useState<{
    key: string;
    options: ShippingOption[];
    configured: boolean;
    unavailable: boolean;
  } | null>(null);

  const cep = selected?.cep ?? "";
  const quoteKey = useMemo(
    () => (cep ? `${cep}|${items.map((i) => `${i.productId}:${i.quantity}`).join(",")}` : ""),
    [cep, items]
  );
  const quoteLoading = Boolean(quoteKey) && quote?.key !== quoteKey;
  const shippingOptions = quote?.key === quoteKey ? quote.options : [];
  const chosenShipping = shippingOptions.find((option) => option.id === deliveryId) ?? null;
  const isPickup = !chosenShipping;
  const shippingCost = chosenShipping?.price ?? 0;
  const grandTotal = totalPrice + shippingCost;

  useEffect(() => {
    if (!user || !quoteKey) return;
    let cancelled = false;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        const token = data.session?.access_token;
        if (!token) throw new Error("sem sessão");
        return fetch("/api/shipping/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ cep, items }),
        });
      })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("falhou"))))
      .then((result) => {
        if (cancelled) return;
        setQuote({
          key: quoteKey,
          options: result.options ?? [],
          configured: Boolean(result.configured),
          unavailable: Boolean(result.unavailable),
        });
      })
      .catch(() => {
        if (!cancelled) setQuote({ key: quoteKey, options: [], configured: true, unavailable: true });
      });
    return () => {
      cancelled = true;
    };
    // items só entra pelo quoteKey (que já resume carrinho + CEP)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, quoteKey]);

  // Nome e telefone vêm do cadastro (user_metadata), preenchidos uma única vez
  const meta = user?.user_metadata;
  if (meta && !prefilled) {
    const nome = `${meta.nome ?? ""} ${meta.sobrenome ?? ""}`.trim();
    if (nome) setCustomerName(nome);
    if (meta.telefone) setPhone(formatPhone(meta.telefone));
    setPrefilled(true);
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-800">
          Faça login pra continuar
        </h1>
        <p className="mt-2 text-neutral-500">
          Você precisa de uma conta pra finalizar o pedido.
        </p>
        <Link
          href="/entrar"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Entrar
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-800">
          Seu carrinho está vazio
        </h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Continuar comprando
        </Link>
      </div>
    );
  }

  const handleSaveAddress = async (address: Address) => {
    setSavingAddress(true);
    setAddressError(null);
    const message = await saveAddress(address);
    setSavingAddress(false);
    if (message) setAddressError("Não deu pra salvar o endereço. Tenta de novo.");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isPickup && !selected) {
      setError("Adicione um endereço de entrega antes de continuar.");
      return;
    }

    setSubmitting(true);

    try {
      const order = await createOrder(user.id, items, products, {
        customerName,
        phone,
        ...(isPickup || !selected
          ? { address: "Retirada na loja", city: "", cep: "" }
          : orderAddressFields(selected)),
      });

      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error("Entre na sua conta de novo pra continuar.");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order.id,
          delivery: isPickup
            ? { method: "pickup" }
            : { method: "shipping", serviceId: chosenShipping.id },
        }),
      });
      const { initPoint, error: apiError } = await response.json();

      if (!initPoint) throw new Error(apiError ?? "Sem link de pagamento");

      clear();
      window.location.assign(initPoint);
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("frete")
          ? err.message
          : "Não deu pra iniciar o pagamento. Tenta de novo em instantes."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-neutral-800">Finalizar pedido</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-neutral-800">Endereço de entrega</h2>

            {selected ? (
              <div className="flex items-start gap-3 rounded-xl border border-brand bg-white p-4">
                <LineIcon name="pin" className="mt-0.5 h-5 w-5 text-brand" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-800">{addressLine(selected)}</p>
                  {addressSecondLine(selected) && (
                    <p className="text-sm text-neutral-500">{addressSecondLine(selected)}</p>
                  )}
                  <button
                    type="button"
                    onClick={openPicker}
                    className="mt-1 text-sm font-medium text-brand hover:underline"
                  >
                    Alterar endereço
                  </button>
                </div>
              </div>
            ) : (
              <AddressForm
                initial={null}
                title="Adicione seu endereço de entrega"
                saving={savingAddress}
                error={addressError}
                onSave={handleSaveAddress}
              />
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-neutral-800">Método de entrega</h2>
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <DeliveryOption
                checked={isPickup}
                onSelect={() => setDeliveryId("pickup")}
                title="Retirada na loja"
                detail="A loja combina o horário de retirada com você pelo telefone informado."
                price="Grátis"
              />
              {shippingOptions.map((option) => (
                <DeliveryOption
                  key={option.id}
                  checked={chosenShipping?.id === option.id}
                  onSelect={() => setDeliveryId(option.id)}
                  title={[option.company, option.name].filter(Boolean).join(" ")}
                  detail={option.days != null ? `${option.days} ${option.days === 1 ? "dia útil" : "dias úteis"}` : undefined}
                  price={formatPrice(option.price)}
                />
              ))}
            </div>
            {!selected && (
              <p className="text-sm text-neutral-500">
                Adicione o endereço acima pra ver as opções de envio.
              </p>
            )}
            {selected && quoteLoading && (
              <p className="text-sm text-neutral-500">Calculando o frete...</p>
            )}
            {selected && !quoteLoading && quote?.unavailable && (
              <p className="text-sm text-neutral-500">
                Não deu pra calcular o frete agora. Você pode retirar na loja ou tentar de novo em
                instantes.
              </p>
            )}
            {selected && !quoteLoading && quote && !quote.unavailable && !quote.configured && (
              <p className="text-sm text-neutral-500">
                Por enquanto só temos retirada na loja.
              </p>
            )}
          </section>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-neutral-800">Contato</h2>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">Nome completo</label>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">Telefone / WhatsApp</label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className={inputClass}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting || (!isPickup && !selected)}
              className="mt-2 rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {submitting ? "Redirecionando..." : `Ir pro pagamento — ${formatPrice(grandTotal)}`}
            </button>
            <p className="text-center text-xs text-neutral-400">
              Você vai ser levado pro Mercado Pago pra concluir o pagamento com segurança.
            </p>
            <a
              href={buildCartWhatsappUrl(items, products, totalPrice, customerName.trim(), {
                label: isPickup
                  ? "Retirada na loja"
                  : [chosenShipping.company, chosenShipping.name].filter(Boolean).join(" "),
                price: shippingCost,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand py-2.5 text-center text-base font-semibold text-brand transition-colors hover:bg-brand/10"
            >
              <LineIcon name="phone" className="h-5 w-5" />
              Finalizar no WhatsApp
            </a>
          </form>
        </div>

        <div className="flex h-fit flex-col gap-3 rounded-xl bg-white p-4">
          <h2 className="font-semibold text-neutral-800">Resumo do pedido</h2>
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return (
              <div key={item.productId} className="flex justify-between gap-3 text-sm">
                <span>
                  {product.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(product.price * item.quantity)}
                </span>
              </div>
            );
          })}
          <div className="flex justify-between text-sm text-neutral-600">
            <span>{isPickup ? "Retirada na loja" : "Frete"}</span>
            <span className="font-medium">{isPickup ? "Grátis" : formatPrice(shippingCost)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 font-bold text-neutral-800">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliveryOption({
  checked,
  onSelect,
  title,
  detail,
  price,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  detail?: string;
  price: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 border-b border-neutral-100 px-4 py-3 last:border-b-0 ${
        checked ? "bg-neutral-50" : ""
      }`}
    >
      <input
        type="radio"
        name="delivery"
        checked={checked}
        onChange={onSelect}
        className="h-4 w-4 accent-green-600"
      />
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-neutral-800">{title}</span>
        {detail && <span className="block text-sm text-neutral-500">{detail}</span>}
      </span>
      <span className="shrink-0 font-semibold text-neutral-800">{price}</span>
    </label>
  );
}
