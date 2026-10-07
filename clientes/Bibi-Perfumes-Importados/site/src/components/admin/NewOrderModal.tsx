"use client";

import { type FormEvent, useEffect, useState } from "react";
import Icon from "./Icon";
import {
  createManualOrder,
  ORDER_STATUSES,
  type OrderStatus,
} from "@/lib/orders";
import { STATUS_STYLE } from "@/lib/order-status";
import { formatPrice, getAllProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

type Row = { productId: string; quantity: number };

export default function NewOrderModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<OrderStatus>("confirmado");
  const [rows, setRows] = useState<Row[]>([{ productId: "", quantity: 1 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  const total = rows.reduce((sum, row) => {
    const product = products.find((p) => p.id === row.productId);
    return product ? sum + product.price * row.quantity : sum;
  }, 0);

  const updateRow = (index: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, { productId: "", quantity: 1 }]);
  const removeRow = (index: number) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const items = rows.filter((r) => r.productId && r.quantity > 0);
    if (!customerName.trim() || !phone.trim()) {
      setError("Preenche nome e telefone do cliente.");
      return;
    }
    if (items.length === 0) {
      setError("Adiciona pelo menos um produto.");
      return;
    }

    setSaving(true);
    try {
      await createManualOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        status,
        items,
        products,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não deu pra salvar. Tenta de novo.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-800">Nova venda manual</h2>
            <p className="text-sm text-neutral-500">Pra registrar uma venda fechada no WhatsApp.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Fechar"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-neutral-600">
              Cliente
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-800 outline-none focus:border-brand"
                placeholder="Nome do cliente"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-neutral-600">
              Telefone / WhatsApp
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-800 outline-none focus:border-brand"
                placeholder="(61) 99999-9999"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-neutral-700">Produtos</p>
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={row.productId}
                  onChange={(e) => updateRow(i, { productId: e.target.value })}
                  className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-800 outline-none focus:border-brand"
                >
                  <option value="">Selecione um produto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatPrice(p.price)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) =>
                    updateRow(i, { quantity: Math.max(1, Number(e.target.value) || 1) })
                  }
                  className="w-16 rounded-lg border border-neutral-200 px-2 py-2 text-sm text-neutral-800 outline-none focus:border-brand"
                />
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="shrink-0 rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                    aria-label="Remover produto"
                  >
                    <Icon name="close" className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="w-fit text-sm font-semibold text-brand hover:underline"
            >
              + Adicionar produto
            </button>
          </div>

          <label className="flex flex-col gap-1 text-sm text-neutral-600">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-neutral-800 outline-none focus:border-brand"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_STYLE[s].label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
            <span className="text-sm text-neutral-500">Total</span>
            <span className="text-lg font-bold text-neutral-800">{formatPrice(total)}</span>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar venda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
