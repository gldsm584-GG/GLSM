"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Icon, { type IconName } from "./Icon";

// Pedidos chegam pelo checkout e também por venda manual (ver /admin/pedidos "Nova venda").
const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "orders" },
  { href: "/admin/produtos", label: "Produtos", icon: "products" },
  { href: "/admin/clientes", label: "Clientes", icon: "users" },
];

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const initials = (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="flex h-full flex-col bg-[#0e1116] text-neutral-400">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Plavii</p>
          <p className="truncate text-xs text-neutral-500">{user?.email}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border-brand-light/30 bg-brand-light/10 text-white"
                  : "border-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                name={item.icon}
                className={`h-5 w-5 ${active ? "text-brand-light" : ""}`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/5 hover:text-white"
        >
          <Icon name="store" />
          Ver loja
        </Link>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-white/5 hover:text-white"
        >
          <Icon name="logout" />
          Sair
        </button>
        <div className="mt-2 px-3 opacity-60">
          <Image src="/logo.png" alt="Plavii" width={70} height={23} className="h-auto w-[70px] brightness-0 invert" />
        </div>
      </div>
    </div>
  );
}
