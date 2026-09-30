"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LineIcon, { ICON_NAMES, type IconName } from "@/components/LineIcon";
import {
  addCategory,
  deleteCategory,
  sameCategory,
  COLOR_PRESETS,
  type Category,
} from "@/lib/categories";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";
import type { Product } from "@/lib/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Aberto/fechado pelo menu único do admin (AdminMenu), não tem gatilho próprio.
export default function CategoriesEditor({
  categories,
  products,
  open,
  onClose,
}: {
  categories: Category[];
  products: Product[];
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [nome, setNome] = useState("");
  const [icon, setIcon] = useState<IconName>(ICON_NAMES[0]);
  const [cor, setCor] = useState<string>(COLOR_PRESETS[0]);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isAdmin(user) || !open) return null;

  const slug = slugify(nome);

  const productCount = (category: Category) =>
    products.filter((p) => sameCategory(p.category, category)).length;

  const resetForm = () => {
    setAdding(false);
    setNome("");
    setIcon(ICON_NAMES[0]);
    setCor(COLOR_PRESETS[0]);
  };

  const handleAdd = async () => {
    setError(null);
    if (!nome.trim() || !slug) {
      setError("Dá um nome pra categoria antes de salvar.");
      return;
    }
    if (categories.some((c) => c.slug === slug)) {
      setError("Já existe uma categoria com esse nome.");
      return;
    }
    setSaving(true);
    try {
      await addCategory({ nome: nome.trim(), slug, icon, cor });
      resetForm();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error && err.message === "NO_PERMISSION"
          ? "Sua conta não tem permissão de admin no Supabase pra editar."
          : "Não deu pra salvar. Tenta de novo."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (category: Category) => {
    setRemovingId(category.id);
    setError(null);
    try {
      await deleteCategory(category.id);
      router.refresh();
    } catch {
      setError("Não deu pra apagar. Tenta de novo.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 md:items-center md:p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl md:rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-800">Categorias</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-neutral-400 hover:text-neutral-600"
          >
            <LineIcon name="close" className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-neutral-500">
          Aparecem no menu &ldquo;Tudo&rdquo; e no cadastro de produto. Uma categoria com produtos
          precisa ficar sem nenhum pra poder ser apagada.
        </p>

        <ul className="flex flex-col gap-2">
          {categories.map((c) => {
            const count = productCount(c);
            return (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 p-2"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white ${c.cor}`}
                >
                  <LineIcon name={c.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-700">{c.nome}</p>
                  <p className="text-xs text-neutral-400">
                    {count > 0 ? `${count} produto${count > 1 ? "s" : ""}` : "Sem produtos"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(c)}
                  disabled={count > 0 || removingId === c.id}
                  title={count > 0 ? "Move os produtos pra outra categoria antes de apagar" : "Apagar"}
                  aria-label={`Apagar categoria ${c.nome}`}
                  className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
                >
                  <LineIcon name="trash" className="h-4 w-4" />
                </button>
              </li>
            );
          })}
          {categories.length === 0 && (
            <p className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
              Nenhuma categoria ainda.
            </p>
          )}
        </ul>

        {adding ? (
          <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">Nome</label>
              <input
                autoFocus
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Jardim e Piscina"
                className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
              />
              {nome && <p className="text-xs text-neutral-400">/categoria/{slug}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">Ícone</label>
              <div className="grid max-h-32 grid-cols-8 gap-1 overflow-y-auto rounded-lg border border-neutral-200 p-2">
                {ICON_NAMES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setIcon(name)}
                    title={name}
                    className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                      icon === name
                        ? "bg-brand text-white"
                        : "text-neutral-500 hover:bg-neutral-100"
                    }`}
                  >
                    <LineIcon name={name} className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">Cor</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCor(preset)}
                    aria-label={`Cor ${preset}`}
                    className={`h-8 w-8 rounded-full bg-gradient-to-br ${preset} transition-transform ${
                      cor === preset ? "ring-2 ring-brand ring-offset-2" : "hover:scale-110"
                    }`}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={saving}
                className="w-fit rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar categoria"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-fit rounded-full px-4 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-3 text-sm font-semibold text-neutral-500 transition-colors hover:border-brand hover:text-brand"
            >
              <LineIcon name="plus" className="h-4 w-4" />
              Nova categoria
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
