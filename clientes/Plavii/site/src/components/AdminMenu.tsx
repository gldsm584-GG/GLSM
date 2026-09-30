"use client";

import { useState } from "react";
import CategoriesEditor from "@/components/CategoriesEditor";
import HeroEditor from "@/components/HeroEditor";
import LineIcon, { type IconName } from "@/components/LineIcon";
import OfertasEditor from "@/components/OfertasEditor";
import type { Category } from "@/lib/categories";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";
import type { HeroSlide } from "@/lib/hero";
import type { SitePage } from "@/lib/site-content";
import type { Product } from "@/lib/types";

type PanelKey = "heroes" | "ofertas" | "categorias";

const ITEMS: { key: PanelKey; label: string; icon: IconName }[] = [
  { key: "heroes", label: "Gerenciar Heroes", icon: "blocks" },
  { key: "ofertas", label: "Gerenciar Ofertas relâmpago", icon: "bolt" },
  { key: "categorias", label: "Gerenciar Categorias", icon: "grid" },
];

// Um botão único (estilo do "Tudo" no header da loja) que junta todos os
// atalhos de edição da home num menu só, em vez de empilhar um botão
// flutuante pra cada painel (Heroes, Ofertas, Categorias...).
export default function AdminMenu({
  heroSlides,
  products,
  ofertasPage,
  categories,
}: {
  heroSlides: HeroSlide[];
  products: Product[];
  ofertasPage: SitePage | null;
  categories: Category[];
}) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<PanelKey | null>(null);

  if (!isAdmin(user)) return null;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {menuOpen && (
          <div className="w-64 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
            {ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActive(item.key);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-brand/5 hover:text-brand"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                  <LineIcon name={item.icon} className="h-4 w-4" />
                </span>
                {item.label}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl transition-colors ${
            menuOpen ? "bg-neutral-800 hover:bg-neutral-700" : "bg-brand hover:bg-brand-dark"
          }`}
        >
          <LineIcon name={menuOpen ? "close" : "menu"} className="h-5 w-5" />
          {menuOpen ? "Fechar" : "Editar site"}
        </button>
      </div>

      <HeroEditor slides={heroSlides} open={active === "heroes"} onClose={() => setActive(null)} />
      <OfertasEditor
        products={products}
        page={ofertasPage}
        open={active === "ofertas"}
        onClose={() => setActive(null)}
      />
      <CategoriesEditor
        categories={categories}
        products={products}
        open={active === "categorias"}
        onClose={() => setActive(null)}
      />
    </>
  );
}
