"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
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
  volumeMl: 100,
  price: 0,
  oldPrice: undefined,
  images: [],
  description: "",
  notesTop: "",
  notesHeart: "",
  notesBase: "",
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
          volumeMl: editing.volumeMl,
          price: editing.price,
          oldPrice: editing.oldPrice,
          images: editing.images.length > 0 ? editing.images : editing.image ? [editing.image] : [],
          description: editing.description,
          notesTop: editing.notesTop,
          notesHeart: editing.notesHeart,
          notesBase: editing.notesBase,
        }
      : emptyForm
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: editing ? f.slug : slugify(name),
      id: editing ? f.id : slugify(name),
    }));
  };

  const handleImagesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Escolhe arquivos de imagem (JPG, PNG ou WebP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Uma das fotos tem mais de 5 MB. Escolhe uma menor.");
        return;
      }
    }

    setError(null);
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadProductImage));
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch {
      setError("Não deu pra enviar as fotos. Tenta de novo.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSetCover = (index: number) => {
    setForm((f) => {
      if (index === 0) return f;
      const images = [...f.images];
      const [chosen] = images.splice(index, 1);
      images.unshift(chosen);
      return { ...f, images };
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (form.images.length === 0) {
      setError("Envia pelo menos uma foto do produto antes de salvar.");
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
          ? "O banco recusou a alteração. Confere se seu email está em ADMIN_EMAILS (src/lib/admin.ts) e na função is_admin() do Supabase."
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
          <label className="text-sm font-medium text-neutral-700">Slug (URL)</label>
          <input
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Volume (ml)</label>
          <input
            required
            type="number"
            min="1"
            value={form.volumeMl}
            onChange={(e) => setForm((f) => ({ ...f, volumeMl: Number(e.target.value) }))}
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

      <div className="flex flex-col gap-2 rounded-lg border border-brand/20 bg-brand/5 p-3">
        <p className="text-sm font-semibold text-brand-dark">Pirâmide olfativa</p>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-600">Notas de topo</label>
          <input
            value={form.notesTop}
            onChange={(e) => setForm((f) => ({ ...f, notesTop: e.target.value }))}
            placeholder="ex: bergamota, pêssego branco, mandarina"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-600">Notas de coração</label>
          <input
            value={form.notesHeart}
            onChange={(e) => setForm((f) => ({ ...f, notesHeart: e.target.value }))}
            placeholder="ex: flor de laranjeira, vetiver"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-600">Notas de fundo</label>
          <input
            value={form.notesBase}
            onChange={(e) => setForm((f) => ({ ...f, notesBase: e.target.value }))}
            placeholder="ex: almíscar, baunilha"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-700">Fotos do produto</label>
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {form.images.map((src, i) => (
              <div
                key={src + i}
                className={`group relative h-20 w-20 overflow-hidden rounded-lg border bg-neutral-100 ${
                  i === 0 ? "border-brand ring-1 ring-brand" : "border-neutral-200"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Prévia" className="h-full w-full object-contain" />
                {i === 0 ? (
                  <span className="absolute bottom-0 left-0 right-0 bg-brand/90 py-0.5 text-center text-[10px] font-semibold text-white">
                    Capa
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetCover(i)}
                    className="absolute inset-x-0 bottom-0 bg-black/50 py-0.5 text-center text-[10px] text-white opacity-0 group-hover:opacity-100"
                  >
                    Tornar capa
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  aria-label="Remover foto"
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={handleImagesChange}
            disabled={uploading}
            className="text-sm text-neutral-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-dark"
          />
          <p className="text-xs text-neutral-400">
            {uploading ? "Enviando fotos..." : "JPG, PNG ou WebP, até 5 MB cada. A primeira é a capa."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-neutral-700">Descrição</label>
        <textarea
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
