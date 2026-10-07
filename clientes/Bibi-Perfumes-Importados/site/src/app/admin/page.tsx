import Link from "next/link";
import Icon from "@/components/admin/Icon";

const CARDS = [
  { href: "/admin/produtos", label: "Produtos", desc: "Cadastre, edite e remova perfumes do catálogo.", icon: "products" as const },
  { href: "/admin/pedidos", label: "Pedidos", desc: "Acompanhe e registre vendas fechadas no WhatsApp.", icon: "orders" as const },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark">Painel Bibi Perfumes</h1>
      <p className="mt-1 text-sm text-neutral-500">O que você quer gerenciar?</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition-colors hover:border-brand"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Icon name={card.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-neutral-800">{card.label}</p>
              <p className="mt-0.5 text-sm text-neutral-500">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
