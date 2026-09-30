"use client";

import { useEffect, useMemo, useState } from "react";
import PeriodSelector from "@/components/admin/PeriodSelector";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import RevenueChart from "@/components/admin/RevenueChart";
import StatCard from "@/components/admin/StatCard";
import StatusBreakdownChart from "@/components/admin/StatusBreakdownChart";
import TopProductsCard from "@/components/admin/TopProductsCard";
import { getAllOrders, type OrderWithItems } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import {
  computeKpis,
  getPeriodRange,
  getRevenueSeries,
  getStatusBreakdown,
  getTopProducts,
  ordersInRange,
  type Period,
} from "@/lib/stats";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderWithItems[] | null>(null);
  const [period, setPeriod] = useState<Period>("30d");

  useEffect(() => {
    getAllOrders().then(setOrders);
  }, []);

  // Tudo derivado em memória a partir de um fetch só — trocar o período não
  // dispara requisição nova nenhuma, só reprocessa o que já está carregado.
  const dashboard = useMemo(() => {
    if (!orders) return null;
    const range = getPeriodRange(period, orders);
    const periodOrders = ordersInRange(orders, range);
    return {
      kpis: computeKpis(orders, period),
      revenueSeries: getRevenueSeries(orders, range),
      statusBreakdown: getStatusBreakdown(periodOrders),
      topProducts: getTopProducts(periodOrders),
      periodOrders,
    };
  }, [orders, period]);

  if (!dashboard) return <p className="text-sm text-neutral-500">Carregando...</p>;

  const { kpis, revenueSeries, statusBreakdown, topProducts, periodOrders } = dashboard;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">Resumo da loja.</p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Receita"
          value={formatPrice(kpis.revenue)}
          hint={`${kpis.paidOrderCount} pedidos pagos`}
          trend={kpis.revenueTrend}
        />
        <StatCard label="Pedidos" value={String(kpis.orderCount)} trend={kpis.orderCountTrend} />
        <StatCard
          label="Ticket médio"
          value={formatPrice(kpis.avgOrderValue)}
          trend={kpis.avgOrderValueTrend}
        />
        <StatCard
          label="Clientes"
          value={String(kpis.customerCount)}
          hint="no período"
          trend={kpis.customerCountTrend}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5">
        <h2 className="font-semibold text-neutral-800">Receita ao longo do tempo</h2>
        <div className="mt-4">
          <RevenueChart data={revenueSeries} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5">
          <h2 className="font-semibold text-neutral-800">Pedidos por status</h2>
          <div className="mt-4">
            <StatusBreakdownChart data={statusBreakdown} />
          </div>
        </div>
        <TopProductsCard products={topProducts} />
      </div>

      <div className="mt-6">
        <RecentOrdersTable orders={periodOrders} />
      </div>
    </div>
  );
}
