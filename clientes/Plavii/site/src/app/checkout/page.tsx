"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import AddressForm from "@/components/AddressForm";
import LineIcon from "@/components/LineIcon";
import { addressLine, addressSecondLine, orderAddressFields, type Address } from "@/lib/addresses";
import { useAddresses } from "@/lib/address-context";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { formatPhone } from "@/lib/profile";
import { supabase } from "@/lib/supabase";

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

    if (!selected) {
      setError("Adicione um endereço de entrega antes de continuar.");
      return;
    }

    setSubmitting(true);

    try {
      const order = await createOrder(user.id, items, products, {
        customerName,
        phone,
        ...orderAddressFields(selected),
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
        body: JSON.stringify({ orderId: order.id }),
      });
      const { initPoint } = await response.json();

      if (!initPoint) throw new Error("Sem link de pagamento");

      clear();
      window.location.assign(initPoint);
    } catch {
      setError("Não deu pra iniciar o pagamento. Tenta de novo em instantes.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-neutral-800">Finalizar pedido</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-neutral-800">Forma de entrega</h2>

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
              disabled={submitting || !selected}
              className="mt-2 rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {submitting ? "Redirecionando..." : `Ir pro pagamento — ${formatPrice(totalPrice)}`}
            </button>
            <p className="text-center text-xs text-neutral-400">
              Você vai ser levado pro Mercado Pago pra concluir o pagamento com segurança.
            </p>
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
          <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 font-bold text-neutral-800">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
