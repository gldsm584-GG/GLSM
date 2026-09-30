import {
  ORDER_STATUSES,
  PAID_STATUSES,
  type OrderStatus,
  type OrderWithItems,
} from "./orders";
import { STATUS_STYLE } from "./order-status";

export type Period = "7d" | "30d" | "90d" | "all";

export const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "all", label: "Tudo" },
];

const PERIOD_DAYS: Record<Exclude<Period, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const DAY_MS = 24 * 60 * 60 * 1000;

export type PeriodRange = { from: Date | null; to: Date };

function oldestOrderDate(orders: OrderWithItems[], fallback: Date): Date {
  if (orders.length === 0) return fallback;
  return orders.reduce(
    (oldest, o) => {
      const d = new Date(o.created_at);
      return d < oldest ? d : oldest;
    },
    new Date(orders[0].created_at)
  );
}

// "all" ainda tem um "from" (o pedido mais antigo) — precisa pra decidir o
// tamanho do bucket do gráfico de receita. Só não tem "período anterior"
// pra comparar (ver getPreviousRange).
export function getPeriodRange(
  period: Period,
  orders: OrderWithItems[],
  now: Date = new Date()
): PeriodRange {
  if (period === "all") return { from: oldestOrderDate(orders, now), to: now };
  const from = new Date(now.getTime() - PERIOD_DAYS[period] * DAY_MS);
  return { from, to: now };
}

// Janela de mesmo tamanho, logo antes do período atual. Base da comparação
// "+12% vs período anterior". Não existe período anterior pra "Tudo".
export function getPreviousRange(range: PeriodRange, period: Period): PeriodRange | null {
  if (period === "all" || !range.from) return null;
  const span = range.to.getTime() - range.from.getTime();
  return { from: new Date(range.from.getTime() - span), to: new Date(range.from.getTime()) };
}

export function ordersInRange(orders: OrderWithItems[], range: PeriodRange): OrderWithItems[] {
  return orders.filter((o) => {
    const t = new Date(o.created_at).getTime();
    if (range.from && t < range.from.getTime()) return false;
    return t <= range.to.getTime();
  });
}

// Único lugar que decide "isso conta como receita de verdade" — antes
// repetido em admin/page.tsx e admin/clientes/page.tsx cada um com sua cópia.
export function paidAmount(order: OrderWithItems): number {
  return PAID_STATUSES.includes(order.status) ? Number(order.total) : 0;
}

function trendPct(current: number, previous: number): number | null {
  if (previous === 0) return null; // sem base pra comparar, não "infinito%"
  return ((current - previous) / previous) * 100;
}

export type Kpis = {
  revenue: number;
  revenueTrend: number | null;
  orderCount: number;
  orderCountTrend: number | null;
  avgOrderValue: number;
  avgOrderValueTrend: number | null;
  customerCount: number;
  customerCountTrend: number | null;
  paidOrderCount: number;
};

function summarize(orders: OrderWithItems[]) {
  const revenue = orders.reduce((sum, o) => sum + paidAmount(o), 0);
  const paidOrderCount = orders.filter((o) => PAID_STATUSES.includes(o.status)).length;
  return {
    revenue,
    orderCount: orders.length,
    avgOrderValue: paidOrderCount > 0 ? revenue / paidOrderCount : 0,
    customerCount: new Set(orders.map((o) => o.user_id)).size,
    paidOrderCount,
  };
}

export function computeKpis(orders: OrderWithItems[], period: Period): Kpis {
  const range = getPeriodRange(period, orders);
  const current = summarize(ordersInRange(orders, range));

  const prevRange = getPreviousRange(range, period);
  const previous = prevRange ? summarize(ordersInRange(orders, prevRange)) : null;

  return {
    revenue: current.revenue,
    revenueTrend: previous ? trendPct(current.revenue, previous.revenue) : null,
    orderCount: current.orderCount,
    orderCountTrend: previous ? trendPct(current.orderCount, previous.orderCount) : null,
    avgOrderValue: current.avgOrderValue,
    avgOrderValueTrend: previous ? trendPct(current.avgOrderValue, previous.avgOrderValue) : null,
    customerCount: current.customerCount,
    customerCountTrend: previous ? trendPct(current.customerCount, previous.customerCount) : null,
    paidOrderCount: current.paidOrderCount,
  };
}

export function formatTrend(pct: number | null): string {
  if (pct === null) return "—";
  const rounded = Math.round(pct);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

export type RevenuePoint = { bucketKey: string; label: string; revenue: number; orders: number };

function daySpan(range: PeriodRange): number {
  if (!range.from) return 0;
  return Math.max(1, Math.ceil((range.to.getTime() - range.from.getTime()) / DAY_MS));
}

// Gráfico de receita: dia a dia até 30 dias de janela, semana a semana até
// 120, mês a mês depois disso — senão "Tudo" numa loja com 1 ano vira um
// gráfico ilegível de 365 barrinhas.
export function getRevenueSeries(orders: OrderWithItems[], range: PeriodRange): RevenuePoint[] {
  if (!range.from) return [];
  const from = range.from;
  const span = daySpan(range);
  const granularity: "day" | "week" | "month" = span <= 30 ? "day" : span <= 120 ? "week" : "month";

  const keyAndLabel = (d: Date): { key: string; label: string } => {
    if (granularity === "day") {
      return {
        key: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      };
    }
    if (granularity === "week") {
      const weekIndex = Math.floor((d.getTime() - from.getTime()) / (7 * DAY_MS));
      const bucketStart = new Date(from.getTime() + weekIndex * 7 * DAY_MS);
      return {
        key: `w${weekIndex}`,
        label: bucketStart.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      };
    }
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
    };
  };

  const buckets = new Map<string, { label: string; revenue: number; orders: number }>();

  // Pré-preenche todo bucket do período com zero — senão um dia sem pedido
  // vira um "buraco" no gráfico em vez de aparecer como zero.
  if (granularity === "month") {
    const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
    const end = new Date(range.to.getFullYear(), range.to.getMonth(), 1);
    while (cursor.getTime() <= end.getTime()) {
      const { key, label } = keyAndLabel(cursor);
      buckets.set(key, { label, revenue: 0, orders: 0 });
      cursor.setMonth(cursor.getMonth() + 1);
    }
  } else {
    const step = granularity === "day" ? DAY_MS : 7 * DAY_MS;
    for (let t = from.getTime(); t <= range.to.getTime(); t += step) {
      const { key, label } = keyAndLabel(new Date(t));
      buckets.set(key, { label, revenue: 0, orders: 0 });
    }
  }

  for (const order of ordersInRange(orders, range)) {
    const { key } = keyAndLabel(new Date(order.created_at));
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.revenue += paidAmount(order);
      bucket.orders += 1;
    }
  }

  return Array.from(buckets.entries()).map(([bucketKey, v]) => ({ bucketKey, ...v }));
}

export type StatusBreakdownPoint = {
  status: OrderStatus;
  label: string;
  count: number;
  revenue: number;
};

// Sempre retorna os 5 status, mesmo com 0 pedidos, na mesma ordem — pra dar
// pra ver de cara "tem pedido empacado em pendente" sem o eixo pular.
export function getStatusBreakdown(orders: OrderWithItems[]): StatusBreakdownPoint[] {
  return ORDER_STATUSES.map((status) => {
    const matching = orders.filter((o) => o.status === status);
    return {
      status,
      label: STATUS_STYLE[status]?.label ?? status,
      count: matching.length,
      revenue: matching.reduce((sum, o) => sum + Number(o.total), 0),
    };
  });
}

export type TopProduct = { name: string; quantity: number; revenue: number };

// Só conta item de pedido pago — ranking de mais vendido precisa refletir
// venda de verdade, não carrinho que nunca foi pago.
export function getTopProducts(orders: OrderWithItems[], limit = 5): TopProduct[] {
  const totals = new Map<string, { quantity: number; revenue: number }>();
  for (const order of orders) {
    if (!PAID_STATUSES.includes(order.status)) continue;
    for (const item of order.order_items) {
      const existing = totals.get(item.product_name) ?? { quantity: 0, revenue: 0 };
      existing.quantity += item.quantity;
      existing.revenue += item.unit_price * item.quantity;
      totals.set(item.product_name, existing);
    }
  }
  return Array.from(totals.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}
