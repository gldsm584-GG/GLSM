import VehiclesPanel from "@/components/admin/VehiclesPanel";

export default function AdminEstoquePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Estoque</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-500">
        Marque &quot;Vendido&quot; quando o carro sair — ele some do site na hora.
      </p>
      <VehiclesPanel />
    </div>
  );
}
