import LineIcon from "@/components/LineIcon";

// Estrelas só pra exibir uma nota (não clicáveis). Arredonda pra estrela mais próxima.
export default function Stars({
  value,
  className = "h-4 w-4",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <LineIcon key={n} name="star" filled={n <= Math.round(value)} className={className} />
      ))}
    </div>
  );
}
