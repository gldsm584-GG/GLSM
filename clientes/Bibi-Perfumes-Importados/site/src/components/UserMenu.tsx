"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LineIcon, { type IconName } from "@/components/LineIcon";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";
import { fullName, profileFromMeta } from "@/lib/profile";

const itemClass =
  "flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:bg-brand/5 hover:text-brand";

export function userDisplay(user: User) {
  const profile = profileFromMeta(user.user_metadata);
  const initials = profile.nome
    ? `${profile.nome[0]}${profile.sobrenome[0] ?? ""}`.toUpperCase()
    : (user.email?.[0] ?? "?").toUpperCase();
  return { nome: profile.nome, full: fullName(profile) || user.email || "", initials };
}

// Menu da conta no cabeçalho (cliente logado ou admin)
export default function UserMenu({ user }: { user: User }) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const { nome, full, initials } = userDisplay(user);

  const link = (href: string, icon: IconName, label: string) => (
    <Link href={href} role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
      <LineIcon name={icon} className="h-5 w-5 text-neutral-400" />
      {label}
    </Link>
  );

  const handleSignOut = async (goTo: string) => {
    setOpen(false);
    await signOut();
    router.push(goTo);
    router.refresh();
  };

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menu da conta"
        className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-brand/10"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[7rem] truncate text-sm font-semibold text-brand-dark sm:block">
          {nome || full}
        </span>
        <LineIcon name="chevron-down" className="h-4 w-4 text-brand-dark/60" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-white pb-2 shadow-2xl ring-1 ring-black/10"
        >
          <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand-dark">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold text-neutral-800">{full}</p>
              <p className="truncate text-xs text-neutral-500">{user.email}</p>
            </div>
          </div>

          <div className="py-2">
            {link("/conta", "grid", "Minha conta")}
            {link("/conta/historico", "clock", "Histórico")}
            {link("/conta/favoritos", "heart", "Favoritos")}
            {link("/conta/dados#endereco", "pin", "Endereço")}
            {link("/conta/dados", "user", "Meus dados")}
          </div>

          {isAdmin(user) && (
            <div className="border-t border-neutral-100 py-2">
              {link("/admin", "shield", "Painel do administrador")}
            </div>
          )}

          <div className="border-t border-neutral-100 pt-2">
            <button
              type="button"
              role="menuitem"
              onClick={() => handleSignOut("/entrar")}
              className={itemClass}
            >
              <LineIcon name="swap" className="h-5 w-5 text-neutral-400" />
              Entrar em outra conta
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleSignOut("/")}
              className={itemClass}
            >
              <LineIcon name="logout" className="h-5 w-5 text-neutral-400" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
