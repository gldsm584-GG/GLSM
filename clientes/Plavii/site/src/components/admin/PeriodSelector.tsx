import { PERIOD_OPTIONS, type Period } from "@/lib/stats";

export default function PeriodSelector({
  value,
  onChange,
}: {
  value: Period;
  onChange: (period: Period) => void;
}) {
  return (
    <div className="flex w-fit gap-1 rounded-full bg-neutral-100 p-1">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            value === option.value
              ? "bg-white text-brand shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
