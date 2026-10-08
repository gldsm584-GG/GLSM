"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Icon from "@/components/admin/Icon";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-dark">
          Faça login pra continuar
        </h1>
        <Link
          href="/entrar"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Entrar
        </Link>
      </div>
    );
  }

  if (!isAdmin(user)) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-dark">Acesso restrito</h1>
        <p className="mt-2 text-neutral-500">
          Essa área é só pra administração da loja.
        </p>
        <Link href="/" className="mt-6 inline-block text-brand hover:underline">
          Voltar pra loja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-0 h-screen">
          <AdminSidebar />
        </div>
      </aside>

      <div className="flex items-center justify-between bg-brand-dark px-4 py-3 md:hidden">
        <span className="font-semibold text-white">Painel Bibi Perfumes</span>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="text-white"
          aria-label="Abrir menu"
        >
          <Icon name="menu" className="h-6 w-6" />
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative h-full w-64">
            <AdminSidebar onNavigate={() => setMenuOpen(false)} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute right-[-44px] top-3 text-white"
              aria-label="Fechar menu"
            >
              <Icon name="close" className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</div>
    </div>
  );
}
