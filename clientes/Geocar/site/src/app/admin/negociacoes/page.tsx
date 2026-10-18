import LeadsBoard from "@/components/admin/LeadsBoard";

export default function AdminNegociacoesPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Negociações</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-500">
        Cada cliente é um cartão: do primeiro contato até a venda.
      </p>
      <LeadsBoard />
    </div>
  );
}
