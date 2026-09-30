import type { OrderStatus } from "./orders";

// Recharts precisa de cor literal (não dá pra passar className do Tailwind
// pro fill/stroke do SVG), então essas cores ficam centralizadas aqui.

// Mesmo azul de marca usado no resto do admin (bg-brand) — mantém o
// gráfico "do mesmo site", não uma paleta genérica de biblioteca.
export const REVENUE_LINE_COLOR = "#175291";

// Cores de status fixas (não são "categóricas" — têm significado: dinheiro
// parado, pago, em rota, entregue, perdido). pendente/entregue/cancelado
// usam os tons de aviso/sucesso/erro já usados nesses casos; confirmado e
// enviado usam os dois azuis de marca, por serem "em andamento".
export const STATUS_CHART_COLORS: Record<OrderStatus, string> = {
  pendente: "#fab219",
  confirmado: "#175291",
  enviado: "#5aa9ff",
  entregue: "#0ca30c",
  cancelado: "#d03b3b",
};

// Barra de "mais vendidos" — um hue só (magnitude, não identidade), mais
// claro que a linha de receita pra não confundir os dois gráficos.
export const TOP_PRODUCT_BAR_COLOR = "#5aa9ff";

// Grade/eixo: mesmo cinza claro já usado nas bordas do site
// (border-neutral-200), sólido — recharts vem tracejado por padrão.
export const CHART_GRID_COLOR = "#e5e5e5";
export const CHART_AXIS_TEXT_COLOR = "#a3a3a3";
