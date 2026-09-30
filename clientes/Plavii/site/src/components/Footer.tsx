import Link from "next/link";
import LineIcon from "@/components/LineIcon";
import type { SitePage } from "@/lib/site-content";

export default function Footer({ pages }: { pages: SitePage[] }) {
  return (
    <footer className="mt-16 bg-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-neutral-400">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="font-semibold text-white">Plavii</p>
            <p className="mt-2">
              Loja multicategoria em Sobradinho/DF — eletrônicos, acessórios,
              brinquedos e utilidades com frete grátis e garantia de verdade.
            </p>
            <div className="mt-3 flex gap-3">
              <a
                href="https://www.instagram.com/plavii.br"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Plavii"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                <LineIcon name="instagram" className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/hometechdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Plavii"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                <LineIcon name="facebook" className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white">Atendimento</p>
            <p className="mt-2">Seg-Sex 9:30-19h · Sáb 9:30-18h</p>
          </div>
          <div>
            <p className="font-semibold text-white">Loja física</p>
            <p className="mt-2">
              Setor de Mansões de Sobradinho, Qms 23, Loja 02 — DF
              <br />
              CEP 73082-260
            </p>
          </div>
          {pages.length > 0 && (
            <div>
              <p className="font-semibold text-white">Páginas</p>
              <ul className="mt-2 flex flex-col gap-1">
                {pages.map((page) => (
                  <li key={page.slug}>
                    <Link href={`/pagina/${page.slug}`} className="hover:text-white">
                      {page.title || "Página"}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className="mt-8 border-t border-white/10 pt-6 text-xs text-neutral-500">
          © 2026 Plavii
        </p>
      </div>
    </footer>
  );
}
