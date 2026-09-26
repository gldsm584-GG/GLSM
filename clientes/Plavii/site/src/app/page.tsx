import Image from "next/image";
import Link from "next/link";
import LineIcon from "@/components/LineIcon";
import ProductCard from "@/components/ProductCard";
import { discountPercent, formatPrice, getAllProducts } from "@/lib/products";

export default async function Home() {
  const products = await getAllProducts();

  // Vitrine do hero: produtos com foto e desconto que faça sentido
  const destaques = products
    .filter((p) => p.image !== "/sem-imagem.svg" && p.price > 0)
    .filter((p) => {
      const off = discountPercent(p);
      return off !== null && off < 90;
    })
    .slice(0, 3);
  const rotacoes = ["-rotate-6", "rotate-3", "-rotate-2"];

  const ofertas = products
    .filter((p) => p.price > 0 && discountPercent(p) !== null && discountPercent(p)! < 90)
    .sort((a, b) => (discountPercent(b) ?? 0) - (discountPercent(a) ?? 0))
    .slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-light/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div className="flex flex-col gap-5">
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-dark">
              <LineIcon name="bolt" className="h-3.5 w-3.5" />
              Ofertas da semana
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Achou, gostou,{" "}
              <span className="text-accent">chegou.</span>
            </h1>
            <p className="max-w-md text-lg text-white/85">
              Eletrônicos, acessórios e utilidades com frete grátis e até 1 ano
              de garantia. Loja física em Sobradinho — atendimento de gente pra
              gente.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#produtos"
                className="rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold text-brand-dark shadow-lg transition-transform hover:scale-105"
              >
                Ver ofertas
              </a>
            </div>
          </div>

          <div className="relative mx-auto hidden h-[470px] w-full max-w-md md:block">
            {destaques.map((p, i) => (
              <Link
                key={p.id}
                href={`/produto/${p.slug}`}
                className={`absolute w-44 overflow-hidden rounded-2xl bg-white text-neutral-800 shadow-2xl transition-transform duration-300 hover:z-10 hover:scale-110 hover:rotate-0 ${rotacoes[i]} ${
                  i === 0 ? "left-0 top-10" : i === 1 ? "right-0 top-0" : "bottom-0 left-[38%]"
                }`}
              >
                <div className="relative aspect-square bg-neutral-50 p-2">
                  <Image src={p.image} alt={p.name} fill className="object-contain p-2" sizes="180px" />
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-xs text-neutral-500">{p.name}</p>
                  <p className="font-extrabold text-brand">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {ofertas.length > 0 && (
        <section className="mx-auto mt-14 max-w-6xl px-4">
          <div className="rounded-3xl bg-gradient-to-r from-accent to-amber-300 p-5 md:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-brand-dark/70">
                  Por tempo limitado
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight text-brand-dark md:text-3xl">
                  Ofertas relâmpago
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {ofertas.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="produtos" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-7 w-1.5 rounded-full bg-brand" />
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-800">
            Todos os produtos
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
