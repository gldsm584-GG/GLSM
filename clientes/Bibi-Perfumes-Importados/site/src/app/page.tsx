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
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-light/40 via-background to-accent/10 px-4 py-16 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-brand-dark">
            <LineIcon name="sparkles" className="h-4 w-4" />
            Catálogo de perfumes árabes
          </span>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-brand-dark md:text-5xl">
            Fragrâncias que contam histórias
          </h1>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Luxo · Elegância · Sofisticação
          </p>
          <p className="mt-2 max-w-md text-neutral-600">
            Perfumes árabes e importados, 100ml, com pirâmide olfativa
            completa em cada produto — topo, coração e fundo.
          </p>
        </div>
      </section>

      <section id="produtos" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-7 w-1.5 rounded-full bg-brand" />
          <h2 className="text-2xl font-extrabold tracking-tight text-brand-dark">
            Todos os perfumes
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
