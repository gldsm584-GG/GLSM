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
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="px-4 py-2">Produto</th>
                <th className="px-4 py-2">Categoria</th>
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
                  <td className="px-4 py-2 text-neutral-500">{product.category}</td>
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
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-neutral-400">
                    Nenhum produto cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
