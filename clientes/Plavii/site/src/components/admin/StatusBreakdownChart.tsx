"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { STATUS_CHART_COLORS } from "@/lib/chart-colors";
import type { StatusBreakdownPoint } from "@/lib/stats";

// Barra horizontal, não pizza — rótulo longo ("Aguardando pagamento") não
// cabe numa fatia, e a ordem fixa dos 5 status deixa fácil ver de cara se
// tem pedido empacado em algum estágio.
export default function StatusBreakdownChart({ data }: { data: StatusBreakdownPoint[] }) {
  const maxCount = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 0, bottom: 4 }}>
          <XAxis type="number" hide domain={[0, maxCount]} />
          <YAxis
            type="category"
            dataKey="label"
            width={140}
            tick={{ fontSize: 12, fill: "#525252" }}
            axisLine={false}
            tickLine={false}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
            {data.map((entry) => (
              <Cell key={entry.status} fill={STATUS_CHART_COLORS[entry.status]} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fill: "#404040", fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
