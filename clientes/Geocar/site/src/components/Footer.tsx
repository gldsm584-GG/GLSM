import Link from "next/link";
import { ENDERECO, INSTAGRAM_URL } from "@/lib/loja";
import { VENDEDORES, linkWhatsapp } from "@/lib/whatsapp";
import Icon from "./Icon";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-sm text-white/65">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs leading-relaxed">
            Seminovos revisados em Sobradinho. Compra, venda, troca e
            financiamento — seu próximo carro está aqui.
          </p>
        </div>

        <div>
          <p className="font-display font-bold text-white">Fale com a gente</p>
          <ul className="mt-3 flex flex-col gap-2">
            {VENDEDORES.map((v) => (
              <li key={v.numero}>
                <a
                  href={linkWhatsapp(v.numero, "Olá! Vim pelo site da Geocar.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white"
                >
                  <Icon name="whatsapp" className="h-4 w-4 text-[#25d366]" />
                  {v.nome} · {v.exibicao}
                </a>
              </li>
            ))}
            <li className="flex items-start gap-2">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {ENDERECO}
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display font-bold text-white">Redes</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 hover:text-white"
          >
            <Icon name="instagram" className="h-5 w-5" />
            @geocarautomoveis
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-white/40">
          <p>© 2026 Geocar Automóveis</p>
          <Link href="/entrar" className="hover:text-white">
            Área da loja
          </Link>
        </div>
      </div>
    </footer>
  );
}
