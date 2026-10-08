"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import LineIcon, { type IconName } from "@/components/LineIcon";
import { userDisplay } from "@/components/UserMenu";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";

const NAV: { href: string; icon: IconName; label: string }[] = [
  { href: "/conta", icon: "grid", label: "Visão geral" },
  { href: "/conta/historico", icon: "clock", label: "Histórico" },
  { href: "/conta/favoritos", icon: "heart", label: "Favoritos" },
  { href: "/conta/dados", icon: "user", label: "Meus dados" },
];

const itemBase =
  "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

export default function ContaLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-bold text-brand-dark">Faça login pra continuar</h1>
        <p className="mt-2 text-neutral-500">Entre na sua conta pra ver seus favoritos e dados.</p>
        <Link
          href={`/entrar?volta=${encodeURIComponent(pathname)}`}
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Entrar
        </Link>
      </div>
    );
  }

  const { full, initials } = userDisplay(user);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[15rem_1fr]">
      <aside className="h-fit min-w-0 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 md:sticky md:top-28">
        <div className="flex items-center gap-3 px-2 py-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-dark text-sm font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold text-neutral-800">{full}</p>
            <p className="truncate text-xs text-neutral-500">{user.email}</p>
          </div>
        </div>

        {/* Celular: quebra em várias linhas, sem precisar arrastar pro lado */}
        <nav className="mt-1 flex flex-wrap gap-1.5 border-t border-neutral-100 pt-2 md:flex-col md:flex-nowrap">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${itemBase} ${
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-neutral-600 hover:bg-brand/5 hover:text-brand"
                }`}
              >
                <LineIcon name={item.icon} className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          {isAdmin(user) && (
            <Link
              href="/admin"
              className={`${itemBase} text-neutral-600 hover:bg-brand/5 hover:text-brand`}
            >
              <LineIcon name="shield" className="h-5 w-5" />
              Painel do administrador
            </Link>
          )}
          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.push("/");
              router.refresh();
            }}
            className={`${itemBase} text-neutral-600 hover:bg-red-50 hover:text-red-500`}
          >
            <LineIcon name="logout" className="h-5 w-5" />
            Sair
          </button>
        </nav>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
