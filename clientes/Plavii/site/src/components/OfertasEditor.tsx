"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LineIcon from "@/components/LineIcon";
import { discountPercent, formatPrice, setProductPromo } from "@/lib/products";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";
import { updateSitePage, type SitePage } from "@/lib/site-content";
import type { Product } from "@/lib/types";

const DEFAULT_TITLE = "Ofertas relâmpago";
const DEFAULT_DESCRICAO = "Por tempo limitado";

// Deixa o admin escolher à mão quais produtos aparecem em "Ofertas
// relâmpago" na home (e editar o selo/título da seção). Sem nenhum
// produto marcado, a home volta a escolher sozinha os com maior desconto.
// Aberto/fechado pelo menu único do admin (AdminMenu), não tem gatilho próprio.
export default function OfertasEditor({
  products,
  page,
  open,
  onClose,
}: {
  products: Product[];
  page: SitePage | null;
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [descricao, setDescricao] = useState(page?.content || DEFAULT_DESCRICAO);
  const [titulo, setTitulo] = useState(page?.title || DEFAULT_TITLE);
  const [savingText, setSavingText] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);
  const router = useRouter();

  if (!isAdmin(user) || !open) return null;

  const handleSaveText = async () => {
    setSavingText(true);
    setTextError(null);
    try {
      await updateSitePage("ofertas", {
        title: titulo.trim() || DEFAULT_TITLE,
        content: descricao.trim() || DEFAULT_DESCRICAO,
      });
      router.refresh();
    } catch (err) {
      setTextError(
        err instanceof Error && err.message === "NO_PERMISSION"
          ? "Sua conta não tem permissão de admin no Supabase pra editar."
          : "Não deu pra salvar. Tenta de novo."
      );
    } finally {
      setSavingText(false);
    }
  };

  const filtered = search.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    : products;

  const selecionados = products.filter((p) => p.isPromo).length;

  const handleToggle = async (product: Product) => {
    setSavingId(product.id);
    setError(null);
    try {
      await setProductPromo(product.id, !product.isPromo);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error && err.message === "NO_PERMISSION"
          ? "Sua conta não tem permissão de admin no Supabase pra editar."
          : "Não deu pra salvar. Tenta de novo."
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 md:items-center md:p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl md:rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-800">Ofertas relâmpago</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-neutral-400 hover:text-neutral-600"
          >
            <LineIcon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Selo (texto pequeno em cima)</label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder={DEFAULT_DESCRICAO}
              className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={DEFAULT_TITLE}
              className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
            />
          </div>
          <button
            type="button"
            onClick={handleSaveText}
            disabled={savingText}
            className="w-fit rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {savingText ? "Salvando..." : "Salvar texto"}
          </button>
          {textError && <p className="text-sm text-red-500">{textError}</p>}
        </div>

        <p className="text-sm text-neutral-500">
          Marca os produtos que quer destacar aqui.{" "}
          {selecionados > 0
            ? `${selecionados} selecionado${selecionados > 1 ? "s" : ""} agora.`
            : "Sem nenhum marcado, a home mostra os produtos com maior desconto automaticamente."}
        </p>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Busca o nome do produto…"
          className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
        />

        <ul className="flex flex-col gap-2">
          {filtered.map((product) => {
            const off = discountPercent(product);
            return (
              <li
                key={product.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 p-2"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  <Image src={product.image} alt="" fill className="object-contain p-1" sizes="56px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-700">{product.name}</p>
                  <p className="text-xs text-neutral-500">
                    {formatPrice(product.price)}
                    {off ? ` · -${off}%` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(product)}
                  disabled={savingId === product.id}
                  aria-pressed={product.isPromo}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    product.isPromo
                      ? "bg-brand text-white hover:bg-brand-dark"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  {product.isPromo ? "Na promoção" : "Adicionar"}
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
              Nenhum produto encontrado.
            </p>
          )}
        </ul>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
