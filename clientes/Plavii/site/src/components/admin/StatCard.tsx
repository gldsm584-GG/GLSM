import LineIcon from "@/components/LineIcon";
import { formatTrend } from "@/lib/stats";

// Cartão de KPI do dashboard: valor grande + (opcional) uma dica curta +
// tendência vs. o período anterior de mesmo tamanho. "—" quando não há
// período anterior pra comparar (ex: período "Tudo").
export default function StatCard({
  label,
  value,
  hint,
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  trend: number | null;
}) {
  const trendColor =
    trend === null || trend === 0
      ? "text-neutral-400"
      : trend > 0
        ? "text-green-600"
        : "text-red-600";

  return (
    <div className="rounded-2xl bg-white p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-neutral-800">{value}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        {hint && <p className="text-xs text-neutral-400">{hint}</p>}
        <span className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
          {trend !== null && trend !== 0 && (
            <LineIcon name={trend > 0 ? "trend-up" : "trend-down"} className="h-3 w-3" />
          )}
          {trend === null ? "—" : `${formatTrend(trend)} vs período anterior`}
        </span>
      </div>
    </div>
  );
}
