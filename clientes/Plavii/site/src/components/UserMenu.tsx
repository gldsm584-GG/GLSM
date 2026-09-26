"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LineIcon, { type IconName } from "@/components/LineIcon";
import { useAddresses } from "@/lib/address-context";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";

const itemClass =
  "flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-brand";

export function userDisplay(meta: Record<string, unknown> | undefined, email: string | undefined) {
  const nome = typeof meta?.nome === "string" ? meta.nome : "";
  const sobrenome = typeof meta?.sobrenome === "string" ? meta.sobrenome : "";
  const full = `${nome} ${sobrenome}`.trim();
  const initials = nome
    ? `${nome[0]}${sobrenome[0] ?? ""}`.toUpperCase()
    : (email?.[0] ?? "?").toUpperCase();
  return { nome, full: full || email || "", initials };
}

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const { openPicker } = useAddresses();
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

  if (!user) return null;

  const { nome, full, initials } = userDisplay(user.user_metadata, user.email);

  const link = (href: string, icon: IconName, label: string) => (
    <Link href={href} onClick={() => setOpen(false)} className={itemClass}>
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
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-neutral-100"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[7rem] truncate text-sm font-medium text-neutral-700 lg:block">
          {nome || full}
        </span>
        <LineIcon name="chevron-down" className="h-4 w-4 text-neutral-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl bg-white pb-2 shadow-2xl ring-1 ring-black/10"
        >
          <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold text-neutral-800">{full}</p>
              <p className="truncate text-xs text-neutral-500">{user.email}</p>
            </div>
          </div>

          <div className="py-2">
            {link("/conta", "grid", "Minha conta")}
            {link("/conta/compras", "bag", "Compras")}
            {link("/conta/historico", "clock", "Histórico")}
            {link("/conta/favoritos", "heart", "Favoritos")}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openPicker();
              }}
              className={itemClass}
            >
              <LineIcon name="pin" className="h-5 w-5 text-neutral-400" />
              Endereços
            </button>
            {link("/conta/dados", "user", "Meus dados")}
          </div>

          {isAdmin(user) && (
            <div className="border-t border-neutral-100 py-2">
              {link("/admin", "shield", "Painel do administrador")}
            </div>
          )}

          <div className="border-t border-neutral-100 pt-2">
            <button type="button" onClick={() => handleSignOut("/entrar")} className={itemClass}>
              <LineIcon name="swap" className="h-5 w-5 text-neutral-400" />
              Entrar em outra conta
            </button>
            <button type="button" onClick={() => handleSignOut("/")} className={itemClass}>
              <LineIcon name="logout" className="h-5 w-5 text-neutral-400" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
