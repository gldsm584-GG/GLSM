"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";

const NAV: { href: string; label: string; icon: IconName; exact?: boolean }[] = [
  { href: "/admin", label: "Início", icon: "dashboard", exact: true },
  { href: "/admin/estoque", label: "Estoque", icon: "car" },
  { href: "/admin/negociacoes", label: "Negociações", icon: "kanban" },
];

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="flex h-full flex-col bg-ink text-white/70">
      <div className="px-5 py-6">
        <Logo />
        <p className="mt-3 truncate text-xs text-white/40">{user?.email}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon name={item.icon} className={`h-5 w-5 ${active ? "text-brand" : ""}`} />
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
          Ver o site
        </Link>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-white/5 hover:text-white"
        >
          <Icon name="logout" />
          Sair
        </button>
      </div>
    </div>
  );
}
