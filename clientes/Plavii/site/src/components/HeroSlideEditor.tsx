"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import LineIcon from "@/components/LineIcon";
import { getCategories, type Category } from "@/lib/categories";
import { getAllProducts } from "@/lib/products";
import { updateHeroSlideButtons, type HeroButton, type HeroSlide } from "@/lib/hero";
import type { Product } from "@/lib/types";

type LinkMode = "vitrine" | "produto" | "categoria" | "personalizado";

// Cores padrão do site (as mesmas do botão "Ver ofertas" do Hero de sempre)
const DEFAULT_TEXT_COLOR = "#0f3a68";
const DEFAULT_BG_COLOR = "#ffc83d";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function newButtonId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// O botão guarda um caminho pronto (ex: /produto/algum-slug) — aqui a
// gente lê esse caminho de volta pra saber que tipo de destino já tava
// escolhido antes (pra reabrir o editor com a opção certa selecionada).
function parseButtonLink(link: string | null): { mode: LinkMode; value: string } {
  if (!link) return { mode: "vitrine", value: "" };
  const produto = link.match(/^\/produto\/(.+)$/);
  if (produto) return { mode: "produto", value: produto[1] };
  const categoria = link.match(/^\/categoria\/(.+)$/);
  if (categoria) return { mode: "categoria", value: categoria[1] };
  return { mode: "personalizado", value: link };
}

function computeLink(
  mode: LinkMode,
  productSlug: string,
  categorySlug: string,
  custom: string
): string | null {
  if (mode === "produto") return productSlug ? `/produto/${productSlug}` : null;
  if (mode === "categoria") return categorySlug ? `/categoria/${categorySlug}` : null;
  if (mode === "personalizado") return custom.trim() || null;
  return null;
}

// A imagem é feita pronta por fora (com texto e chamada já desenhados,
// tipo os Heroes da Rockstar Games) — aqui o admin monta os botões
// flutuantes: arrasta pra qualquer canto da imagem (mostrada em tamanho
// real, igual aparece no site) e usa o + pra adicionar mais de um.
export default function HeroSlideEditor({
  slide,
  onDone,
  onCancel,
}: {
  slide: HeroSlide;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [buttons, setButtons] = useState<HeroButton[]>(slide.buttons ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(buttons[0]?.id ?? null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = buttons.find((b) => b.id === selectedId) ?? null;

  const [linkMode, setLinkMode] = useState<LinkMode>("vitrine");
  const [linkProductSlug, setLinkProductSlug] = useState("");
  const [linkCategorySlug, setLinkCategorySlug] = useState("");
  const [linkCustom, setLinkCustom] = useState("");
  const [linkProductSearch, setLinkProductSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Troca de botão selecionado: recarrega o "pra onde leva" desse botão
  // nos campos de edição (cada botão tem o seu, guardado só no link final).
  useEffect(() => {
    const sel = buttons.find((b) => b.id === selectedId);
    const parsed = parseButtonLink(sel?.link ?? null);
    setLinkMode(parsed.mode);
    setLinkProductSlug(parsed.mode === "produto" ? parsed.value : "");
    setLinkCategorySlug(parsed.mode === "categoria" ? parsed.value : "");
    setLinkCustom(parsed.mode === "personalizado" ? parsed.value : "");
    setLinkProductSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const filtered = linkProductSearch.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(linkProductSearch.trim().toLowerCase()))
        .slice(0, 6)
    : [];

  const updateSelected = (patch: Partial<HeroButton>) => {
    if (!selectedId) return;
    setButtons((prev) => prev.map((b) => (b.id === selectedId ? { ...b, ...patch } : b)));
  };

  const updateSelectedLink = (mode: LinkMode, productSlug: string, categorySlug: string, custom: string) => {
    updateSelected({ link: computeLink(mode, productSlug, categorySlug, custom) });
  };

  const handleAddButton = () => {
    const button: HeroButton = {
      id: newButtonId(),
      text: "Novo botão",
      link: null,
      text_color: DEFAULT_TEXT_COLOR,
      bg_color: DEFAULT_BG_COLOR,
      x: 50,
      y: 50,
    };
    setButtons((prev) => [...prev, button]);
    setSelectedId(button.id);
  };

  const handleRemoveButton = (id: string) => {
    const next = buttons.filter((b) => b.id !== id);
    setButtons(next);
    setSelectedId(next.length > 0 ? next[0].id : null);
  };

  const setPositionFromPoint = (clientX: number, clientY: number, id: string) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clamp(((clientX - rect.left) / rect.width) * 100, 3, 97);
    const y = clamp(((clientY - rect.top) / rect.height) * 100, 5, 95);
    setButtons((prev) => prev.map((b) => (b.id === id ? { ...b, x, y } : b)));
  };

  const handleButtonPointerDown = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingId(id);
    setSelectedId(id);
  };

  const handleButtonPointerMove = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    if (draggingId !== id) return;
    setPositionFromPoint(e.clientX, e.clientY, id);
  };

  const handleButtonPointerUp = () => setDraggingId(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const cleaned = buttons.map((b) => ({ ...b, text: b.text.trim() })).filter((b) => b.text.length > 0);
      await updateHeroSlideButtons(slide.id, cleaned);
      onDone();
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-3">
        <h2 className="text-lg font-bold text-neutral-800">Botões do Hero</h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Fechar"
          className="text-neutral-400 hover:text-neutral-600"
        >
          <LineIcon name="close" className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <p className="px-4 pt-3 text-sm text-neutral-500">
          A imagem tá em tamanho real, igual aparece no site. Arraste um botão pra qualquer
          canto e toca no + pra adicionar outro.
        </p>

        <div
          ref={containerRef}
          className="relative mt-3 aspect-[4/3] w-full touch-none select-none overflow-hidden bg-neutral-100 sm:aspect-[16/9] md:aspect-[21/9]"
        >
          <Image src={slide.image_url} alt="" fill className="object-cover" sizes="100vw" />

          {buttons.map((b) => (
            <div
              key={b.id}
              onPointerDown={(e) => handleButtonPointerDown(e, b.id)}
              onPointerMove={(e) => handleButtonPointerMove(e, b.id)}
              onPointerUp={handleButtonPointerUp}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                color: b.text_color || DEFAULT_TEXT_COLOR,
                backgroundColor: b.bg_color || DEFAULT_BG_COLOR,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-extrabold shadow-lg active:cursor-grabbing sm:px-7 sm:py-3.5 ${
                selectedId === b.id ? "ring-2 ring-brand ring-offset-2" : ""
              }`}
            >
              {b.text || "Botão"}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddButton}
            title="Adicionar botão"
            aria-label="Adicionar botão"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-lg transition-transform hover:scale-105"
          >
            <LineIcon name="plus" className="h-5 w-5" />
          </button>
        </div>

        {selected ? (
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">Texto do botão</label>
              <div className="flex items-center gap-2">
                <input
                  value={selected.text}
                  onChange={(e) => updateSelected({ text: e.target.value })}
                  placeholder="Ver ofertas"
                  className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveButton(selected.id)}
                  title="Remover esse botão"
                  aria-label="Remover esse botão"
                  className="shrink-0 rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <LineIcon name="trash" className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-700">Cor da letra</label>
                <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-2 py-1.5">
                  <input
                    type="color"
                    value={selected.text_color || DEFAULT_TEXT_COLOR}
                    onChange={(e) => updateSelected({ text_color: e.target.value })}
                    className="h-8 w-8 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="text-sm text-neutral-500">{selected.text_color || DEFAULT_TEXT_COLOR}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-700">Cor do fundo</label>
                <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-2 py-1.5">
                  <input
                    type="color"
                    value={selected.bg_color || DEFAULT_BG_COLOR}
                    onChange={(e) => updateSelected({ bg_color: e.target.value })}
                    className="h-8 w-8 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="text-sm text-neutral-500">{selected.bg_color || DEFAULT_BG_COLOR}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">Pra onde o botão leva?</label>
              <select
                value={linkMode}
                onChange={(e) => {
                  const mode = e.target.value as LinkMode;
                  setLinkMode(mode);
                  updateSelectedLink(mode, linkProductSlug, linkCategorySlug, linkCustom);
                }}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 outline-none focus:border-brand"
              >
                <option value="vitrine">Vitrine de produtos (padrão)</option>
                <option value="produto">Um produto</option>
                <option value="categoria">Uma categoria</option>
                <option value="personalizado">Link personalizado</option>
              </select>

              {linkMode === "produto" &&
                (linkProductSlug ? (
                  <div className="mt-1 flex items-center justify-between gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                    <span className="truncate text-neutral-700">
                      {products.find((p) => p.slug === linkProductSlug)?.name ?? linkProductSlug}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setLinkProductSlug("");
                        updateSelectedLink(linkMode, "", linkCategorySlug, linkCustom);
                      }}
                      aria-label="Trocar produto"
                      className="shrink-0 text-neutral-400 hover:text-red-500"
                    >
                      <LineIcon name="close" className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 flex flex-col gap-1">
                    <input
                      value={linkProductSearch}
                      onChange={(e) => setLinkProductSearch(e.target.value)}
                      placeholder="Busca o nome do produto…"
                      className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
                    />
                    {filtered.length > 0 && (
                      <ul className="overflow-hidden rounded-lg border border-neutral-100">
                        {filtered.map((p) => (
                          <li key={p.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setLinkProductSlug(p.slug);
                                setLinkProductSearch("");
                                updateSelectedLink(linkMode, p.slug, linkCategorySlug, linkCustom);
                              }}
                              className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                            >
                              {p.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

              {linkMode === "categoria" && (
                <select
                  value={linkCategorySlug}
                  onChange={(e) => {
                    setLinkCategorySlug(e.target.value);
                    updateSelectedLink(linkMode, linkProductSlug, e.target.value, linkCustom);
                  }}
                  className="mt-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 outline-none focus:border-brand"
                >
                  <option value="" disabled>
                    Escolhe a categoria…
                  </option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              )}

              {linkMode === "personalizado" && (
                <input
                  value={linkCustom}
                  onChange={(e) => {
                    setLinkCustom(e.target.value);
                    updateSelectedLink(linkMode, linkProductSlug, linkCategorySlug, e.target.value);
                  }}
                  placeholder="https://…"
                  className="mt-1 rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
                />
              )}
            </div>
          </div>
        ) : (
          <p className="px-4 py-10 text-center text-sm text-neutral-400">
            Nenhum botão ainda. Toca no + em cima da imagem pra adicionar.
          </p>
        )}

        {error && <p className="px-4 pb-2 text-sm text-red-500">{error}</p>}
      </div>

      <div className="flex shrink-0 gap-2 border-t border-neutral-200 px-4 py-3">
        <button
          type="button"
          onClick={handleSave}
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
    </div>
  );
}
