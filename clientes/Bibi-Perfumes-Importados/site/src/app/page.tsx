import LineIcon from "@/components/LineIcon";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/products";

// Sem isso, o Next.js congela essa página no build e produtos
// cadastrados/editados pelo admin não apareceriam até o próximo deploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getAllProducts();

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-dark via-[#4a1630] to-brand px-4 py-24 text-center md:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(192,151,90,0.28),transparent_60%)]"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
          <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.4em] text-accent">
            <LineIcon name="sparkles" className="h-4 w-4" />
            Catálogo de perfumes árabes
          </span>
          <h1 className="font-serif text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
            Fragrâncias que contam histórias
          </h1>
          <span className="my-1 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-brand-light">
            Luxo · Elegância · Sofisticação
          </p>
          <p className="mt-3 max-w-md font-light leading-relaxed text-white/70">
            Perfumes árabes e importados, 100ml, com pirâmide olfativa
            completa em cada produto — topo, coração e fundo.
          </p>
          <a
            href="#produtos"
            className="mt-6 rounded-full border border-accent px-8 py-3 text-xs font-medium uppercase tracking-[0.25em] text-accent transition-colors hover:bg-accent hover:text-brand-dark"
          >
            Ver coleção
          </a>
        </div>
      </section>

      <section id="produtos" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <h2 className="font-serif text-4xl font-semibold text-brand-dark">
            Todos os perfumes
          </h2>
          <span className="h-px w-16 bg-accent" />
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
