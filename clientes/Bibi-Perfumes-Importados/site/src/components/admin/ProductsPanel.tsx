"use client";

import { useEffect, useState } from "react";
import { deleteProduct, formatPrice, getAllProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import ProductForm from "./ProductForm";

export default function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (product: Product) => {
    if (!confirm(`Apagar "${product.name}"? Não dá pra desfazer.`)) return;
    await deleteProduct(product.id);
    load();
  };

  const handleDone = () => {
    setShowForm(false);
    setEditing(null);
    load();
  };

  return (
    <div className="flex flex-col gap-4">
      {showForm ? (
        <ProductForm
          editing={editing}
          onDone={handleDone}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-fit rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Novo produto
        </button>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando...</p>
      ) : products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-neutral-400">
          Nenhum produto cadastrado ainda.
        </p>
      ) : (
        <>
          {/* Celular: cartão por produto, sem precisar arrastar pro lado */}
          <div className="flex flex-col gap-3 md:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-xl border border-neutral-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-neutral-800">{product.name}</p>
                    <p className="text-sm text-neutral-500">{product.volumeMl}ml</p>
                  </div>
                  <p className="shrink-0 font-semibold text-neutral-800">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-4 border-t border-neutral-100 pt-3 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(product);
                      setShowForm(true);
                    }}
                    className="font-medium text-brand hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="font-medium text-red-500 hover:underline"
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: tabela */}
          <div className="hidden overflow-hidden rounded-xl border border-neutral-200 bg-white md:block">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-neutral-500">
                <tr>
                  <th className="px-4 py-2">Produto</th>
                  <th className="px-4 py-2">Volume</th>
                  <th className="px-4 py-2">Preço</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-neutral-100">
                    <td className="px-4 py-2 font-medium text-neutral-800">
                      {product.name}
                    </td>
                    <td className="px-4 py-2 text-neutral-500">{product.volumeMl}ml</td>
                    <td className="px-4 py-2">{formatPrice(product.price)}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(product);
                          setShowForm(true);
                        }}
                        className="mr-3 font-medium text-brand hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="font-medium text-red-500 hover:underline"
                      >
                        Apagar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
