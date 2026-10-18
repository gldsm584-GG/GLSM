// Marca em texto no estilo da logo ("GEO" + "CAR" em vermelho), usada
// enquanto o arquivo da logo oficial não está no projeto.
export default function Logo({
  className = "",
  light = true,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="font-display text-2xl font-extrabold italic tracking-tight">
        <span className={light ? "text-white" : "text-azul"}>GEO</span>
        <span className="text-brand">CAR</span>
      </span>
      <span
        className={`mt-0.5 text-[9px] font-semibold uppercase tracking-[0.42em] ${
          light ? "text-celeste" : "text-azul"
        }`}
      >
        Automóveis
      </span>
    </span>
  );
}
