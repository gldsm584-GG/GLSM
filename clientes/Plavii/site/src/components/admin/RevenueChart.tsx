"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_AXIS_TEXT_COLOR, CHART_GRID_COLOR, REVENUE_LINE_COLOR } from "@/lib/chart-colors";
import { formatPrice } from "@/lib/products";
import type { RevenuePoint } from "@/lib/stats";

function compactCurrency(value: number): string {
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
  }
  return String(Math.round(value));
}

function RevenueTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload as RevenuePoint;
  return (
    <div className="rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-semibold">{point.label}</p>
      <p className="mt-1 text-neutral-200">{formatPrice(point.revenue)}</p>
      <p className="text-neutral-400">
        {point.orders} pedido{point.orders !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={CHART_GRID_COLOR} strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: CHART_AXIS_TEXT_COLOR }}
            axisLine={{ stroke: CHART_GRID_COLOR }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 12, fill: CHART_AXIS_TEXT_COLOR }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={compactCurrency}
          />
          <Tooltip content={RevenueTooltip} cursor={{ stroke: CHART_GRID_COLOR, strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={REVENUE_LINE_COLOR}
            strokeWidth={2}
            fill={REVENUE_LINE_COLOR}
            fillOpacity={0.1}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: REVENUE_LINE_COLOR }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
