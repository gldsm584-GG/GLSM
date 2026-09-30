"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getCategories, type Category } from "@/lib/categories";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
  type ProductInput,
} from "@/lib/products";
import type { Product } from "@/lib/types";

const emptyForm: ProductInput = {
  id: "",
  slug: "",
  name: "",
  category: "",
  price: 0,
  oldPrice: undefined,
  image: "",
  description: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({
  editing,
  onDone,
  onCancel,
}: {
  editing: Product | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductInput>(
    editing
      ? {
          id: editing.id,
          slug: editing.slug,
          name: editing.name,
          category: editing.category,
          price: editing.price,
          oldPrice: editing.oldPrice,
          image: editing.image,
          description: editing.description,
        }
      : emptyForm
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: editing ? f.slug : slugify(name),
      id: editing ? f.id : slugify(name),
    }));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Escolhe um arquivo de imagem (JPG, PNG ou WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("A foto tem mais de 5 MB. Escolhe uma menor.");
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch {
      setError("Não deu pra enviar a foto. Tenta de novo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.image || form.image === "/sem-imagem.svg") {
      setError("Envia uma foto do produto antes de salvar.");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateProduct(editing.id, form);
      } else {
        await createProduct(form);
      }
      onDone();
    } catch (err) {
      setError(
        err instanceof Error && err.message === "NO_PERMISSION"
          ? "O banco recusou a alteração. Sua conta não tem permissão de admin no Supabase — rode o SQL 005_admin_gustest.sql e entre com o email admin."
          : "Não deu pra salvar. Confere se o identificador já existe."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4"
    >
      <h3 className="font-semibold text-neutral-800">
        {editing ? "Editar produto" : "Novo produto"}
      </h3>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-neutral-700">Nome</label>
        <input
          required
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Categoria</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 outline-none focus:border-brand"
          >
            <option value="" disabled>
              Escolha…
            </option>
            {form.category && !categories.some((c) => c.nome === form.category) && (
              <option value={form.category}>{form.category}</option>
            )}
            {categories.map((c) => (
              <option key={c.slug} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Slug (URL)</label>
          <input
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Preço (R$)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">
            Preço antigo (opcional)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.oldPrice ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                oldPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-700">Foto do produto</label>
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
            {form.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image} alt="Prévia" className="h-full w-full object-contain" />
            ) : (
              <span className="text-xs text-neutral-400">Sem foto</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              disabled={uploading}
              className="text-sm text-neutral-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-dark"
            />
            <p className="text-xs text-neutral-400">
              {uploading ? "Enviando foto..." : "JPG, PNG ou WebP, até 5 MB."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-neutral-700">Descrição</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-5 py-2 text-sm font-semibold text-neutral-500 hover:bg-neutral-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
