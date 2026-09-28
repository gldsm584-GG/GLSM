"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LineIcon, { type IconName } from "@/components/LineIcon";
import { getOrder, type OrderWithItems } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

const STATUS_INFO: Record<
  string,
  { icon: IconName; title: string; className: string }
> = {
  confirmado: {
    icon: "check-circle",
    title: "Pagamento confirmado!",
    className: "text-green-600",
  },
  pendente: {
    icon: "clock",
    title: "Aguardando confirmação do pagamento",
    className: "text-amber-600",
  },
  cancelado: {
    icon: "x-circle",
    title: "Pagamento não foi aprovado",
    className: "text-red-500",
  },
  enviado: { icon: "package", title: "Pedido enviado", className: "text-brand" },
  entregue: { icon: "check-circle", title: "Pedido entregue", className: "text-green-600" },
};

export default function PedidoPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [error, setError] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(!!paymentId);

  const load = () => {
    getOrder(id)
      .then(setOrder)
      .catch(() => setError(true));
  };

  useEffect(load, [id]);

  useEffect(() => {
    if (!paymentId) return;
    fetch(`/api/mercadopago/verify?payment_id=${paymentId}`)
      .finally(() => {
        setCheckingPayment(false);
        load();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(false);

  // Gera um novo link de pagamento pro pedido que ficou aguardando
  const handlePay = async () => {
    setPaying(true);
    setPayError(false);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });
      const { initPoint } = await response.json();
      if (!initPoint) throw new Error("Sem link de pagamento");
      window.location.assign(initPoint);
    } catch {
      setPayError(true);
      setPaying(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-800">
          Pedido não encontrado
        </h1>
        <Link href="/" className="mt-6 inline-block text-brand hover:underline">
          Voltar pra loja
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const status = STATUS_INFO[order.status] ?? STATUS_INFO.pendente;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl bg-white p-6 text-center">
        <LineIcon
          name={checkingPayment ? "clock" : status.icon}
          className={`mx-auto h-12 w-12 ${checkingPayment ? "text-amber-600" : status.className}`}
        />
        <h1 className={`mt-3 text-2xl font-bold ${status.className}`}>
          {checkingPayment ? "Confirmando pagamento..." : status.title}
        </h1>
        <p className="mt-1 text-neutral-500">
          Número do pedido: <span className="font-mono">{order.id.slice(0, 8)}</span>
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6">
        <h2 className="mb-3 font-semibold text-neutral-800">Itens</h2>
        <div className="flex flex-col gap-2">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span className="font-medium">
                {formatPrice(item.unit_price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t border-neutral-100 pt-3 font-bold text-neutral-800">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 text-sm text-neutral-600">
        <h2 className="mb-2 font-semibold text-neutral-800">Entrega</h2>
        <p>{order.customer_name}</p>
        <p>{order.address}</p>
        <p>
          {order.city} — CEP {order.cep}
        </p>
        <p>{order.phone}</p>
      </div>

      {order.status === "pendente" ? (
        <div className="mt-6 flex flex-col gap-3">
          {payError && (
            <p className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
              Não deu pra iniciar o pagamento. Tenta de novo em instantes.
            </p>
          )}
          {!checkingPayment && (
            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="rounded-full bg-brand py-3 text-center font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {paying ? "Abrindo pagamento..." : "Finalizar compra"}
            </button>
          )}
          <Link
            href="/conta/compras"
            className="rounded-full py-3 text-center font-semibold text-brand ring-1 ring-brand/30 transition-colors hover:bg-brand/5"
          >
            Voltar para a página de compras
          </Link>
        </div>
      ) : (
        <Link
          href="/"
          className="mt-6 block rounded-full bg-brand py-3 text-center font-semibold text-white hover:bg-brand-dark"
        >
          Voltar pra loja
        </Link>
      )}
    </div>
  );
}
