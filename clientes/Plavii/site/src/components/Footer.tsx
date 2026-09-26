export default function Footer() {
  return (
    <footer className="mt-16 bg-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-neutral-400">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-semibold text-white">Plavii</p>
            <p className="mt-2">
              Loja multicategoria em Sobradinho/DF — eletrônicos, acessórios,
              brinquedos e utilidades com frete grátis e garantia de verdade.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Atendimento</p>
            <p className="mt-2">
              Seg-Sex 9:30-19h · Sáb 9:30-18h
              <br />
              (61) 99233-2876
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Loja física</p>
            <p className="mt-2">
              Setor de Mansões de Sobradinho, Qms 23, Loja 02 — DF
              <br />
              CEP 73082-260
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-white/10 pt-6 text-xs text-neutral-500">
          © 2026 Plavii — CNPJ 36.036.237/0001-70
        </p>
      </div>
    </footer>
  );
}
