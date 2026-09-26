import OrdersPanel from "@/components/admin/OrdersPanel";

export default function AdminPedidosPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800">Pedidos</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-500">
        Acompanhe e atualize o status de cada pedido.
      </p>
      <OrdersPanel />
    </div>
  );
}
