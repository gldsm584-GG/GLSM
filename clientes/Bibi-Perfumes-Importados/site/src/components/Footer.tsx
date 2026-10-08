import Image from "next/image";
import Link from "next/link";
import LineIcon from "@/components/LineIcon";

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-dark">
      <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-white/70">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Image
              src="/logo.png"
              alt="Bibi Perfumes Importados"
              width={88}
              height={88}
              className="mb-3 h-22 w-22 rounded-full ring-2 ring-accent/40"
            />
            <p className="font-serif text-xl font-semibold text-white">Bibi Perfumes Importados</p>
            <p className="mt-2">
              Perfumes árabes e importados, com notas de topo, coração e
              fundo escolhidas pra contar uma história.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Fale com a gente</p>
            <a
              href="/carrinho"
              className="mt-2 flex items-center gap-1.5 hover:text-white"
            >
              <LineIcon name="phone" className="h-4 w-4" />
              Pedidos direto pelo WhatsApp
            </a>
          </div>
          <div>
            <p className="font-semibold text-white">Redes</p>
            <div className="mt-2 flex gap-3">
              <LineIcon name="instagram" className="h-5 w-5" />
              <LineIcon name="facebook" className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50">
          <p>© 2026 Bibi Perfumes Importados</p>
          <Link href="/politica-de-privacidade" className="hover:text-white">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
