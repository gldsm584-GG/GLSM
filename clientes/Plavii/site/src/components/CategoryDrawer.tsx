"use client";

import Link from "next/link";
import { useEffect } from "react";
import LineIcon from "@/components/LineIcon";
import { CATEGORIES } from "@/lib/categories";

export default function CategoryDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Categorias"
        className={`absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between bg-brand px-5 py-4 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Plavii
            </p>
            <h2 className="text-lg font-extrabold">Todas as categorias</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition-colors hover:bg-white/15"
          >
            <LineIcon name="close" className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-brand transition-colors hover:bg-brand/5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-base">
              <LineIcon name="bolt" className="h-5 w-5 text-brand-dark" />
            </span>
            Ofertas da semana
          </Link>
          <div className="mx-5 my-2 border-t border-black/5" />
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/categoria/${c.slug}`}
              onClick={onClose}
              className="group flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-brand/5 hover:text-brand"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-base transition-colors group-hover:bg-brand/10">
                <LineIcon name={c.icon} className="h-5 w-5 text-neutral-600 group-hover:text-brand" />
              </span>
              {c.nome}
              <span className="ml-auto text-neutral-300 transition-transform group-hover:translate-x-1 group-hover:text-brand">
                ›
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
