"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminEditButton from "@/components/AdminEditButton";
import ProductForm from "@/components/admin/ProductForm";
import LineIcon from "@/components/LineIcon";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";
import type { Product } from "@/lib/types";

// Deixa o admin editar o produto direto na página da loja (sem ir no
// painel), reaproveitando o mesmo formulário do /admin/produtos.
export default function ProductInlineEditor({ product }: { product: Product }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!isAdmin(user)) return null;

  return (
    <>
      <AdminEditButton label="Editar produto" editing={open} onClick={() => setOpen((v) => !v)} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 md:items-center md:p-4">
          <div className="flex max-h-[90vh] w-full max-w-xl flex-col gap-3 overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl md:rounded-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-800">Editar produto</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="text-neutral-400 hover:text-neutral-600"
              >
                <LineIcon name="close" className="h-5 w-5" />
              </button>
            </div>
            <ProductForm
              editing={product}
              onDone={() => {
                setOpen(false);
                router.refresh();
              }}
              onCancel={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
