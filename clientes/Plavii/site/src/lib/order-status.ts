export const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  pendente: { label: "Aguardando pagamento", className: "bg-amber-100 text-amber-700" },
  confirmado: { label: "Pagamento confirmado", className: "bg-green-100 text-green-700" },
  enviado: { label: "Enviado", className: "bg-blue-100 text-blue-700" },
  entregue: { label: "Entregue", className: "bg-green-100 text-green-700" },
  cancelado: { label: "Cancelado", className: "bg-red-100 text-red-600" },
};

export function statusStyle(status: string) {
  return STATUS_STYLE[status] ?? STATUS_STYLE.pendente;
}

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
