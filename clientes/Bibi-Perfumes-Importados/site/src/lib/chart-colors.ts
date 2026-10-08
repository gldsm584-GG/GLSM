import type { OrderStatus } from "./orders";

// Cores fixas do kanban de pedidos (precisam ser cor literal, não dá pra
// usar className do Tailwind no style inline das colunas).
export const STATUS_CHART_COLORS: Record<OrderStatus, string> = {
  pendente: "#d4af37",
  confirmado: "#c2185b",
  enviado: "#f48fb1",
  entregue: "#0ca30c",
  cancelado: "#d03b3b",
};
