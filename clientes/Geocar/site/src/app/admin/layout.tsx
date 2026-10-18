"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";
import { supabaseConfigured } from "@/lib/supabase";

function Aviso({ titulo, texto, acao }: { titulo: string; texto: string; acao: ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-extrabold text-ink">{titulo}</h1>
      <p className="mt-2 text-neutral-500">{texto}</p>
      <div className="mt-6">{acao}</div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!supabaseConfigured) {
    return (
      <Aviso
        titulo="Painel desativado"
        texto="O site está em modo demonstração. Ligue o Supabase (variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY) pra usar o painel."
        acao={
          <Link href="/" className="font-semibold text-brand hover:underline">
            Voltar pro site
          </Link>
        }
      />
    );
  }

  if (loading) return null;

  if (!user) {
    return (
      <Aviso
        titulo="Faça login pra continuar"
        texto="Essa área é só pra equipe da Geocar."
        acao={
          <Link
            href="/entrar"
            className="inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
          >
            Entrar
          </Link>
        }
      />
    );
  }

  if (!isAdmin(user)) {
    return (
      <Aviso
        titulo="Acesso restrito"
        texto="Esse login não tem permissão pra mexer no painel."
        acao={
          <Link href="/" className="font-semibold text-brand hover:underline">
            Voltar pro site
          </Link>
        }
      />
    );
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-60 shrink-0 md:block">
        <div className="sticky top-0 h-screen">
          <AdminSidebar />
        </div>
      </aside>

      <div className="sticky top-0 z-30 flex items-center justify-between bg-ink px-4 py-3 md:hidden">
        <Logo />
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
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
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
