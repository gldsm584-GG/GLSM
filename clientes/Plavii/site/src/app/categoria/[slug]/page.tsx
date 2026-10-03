import Link from "next/link";
import LineIcon from "@/components/LineIcon";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getCategoryBySlug, sameCategory } from "@/lib/categories";
import { getAllProducts } from "@/lib/products";

// Mesma razão do page.tsx da home: sem isso, o Next.js congela a página no
// build e edições do admin (produto novo, categoria editada) não aparecem
// até o próximo deploy.
export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = (await getAllProducts()).filter((p) =>
    sameCategory(p.category, category),
  );

  return (
    <div>
      <section className={`bg-gradient-to-br ${category.cor} py-10 text-white`}>
        <div className="mx-auto max-w-6xl px-4">
          <nav className="mb-3 text-sm text-white/80">
            <Link href="/" className="hover:underline">
              Início
            </Link>
            <span className="mx-2">/</span>
            {category.nome}
          </nav>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            <LineIcon name={category.icon} className="h-9 w-9" />
            {category.nome}
          </h1>
          <p className="mt-2 text-white/85">
            {products.length === 0
              ? "Novidades chegando em breve"
              : `${products.length} ${products.length === 1 ? "produto" : "produtos"}`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
            <LineIcon name={category.icon} className="mx-auto h-14 w-14 text-neutral-300" />
            <p className="mt-4 text-lg font-bold text-neutral-800">
              Ainda não temos produtos em {category.nome}
            </p>
            <p className="mt-1 text-neutral-500">
              Estamos abastecendo essa categoria. Enquanto isso, dá uma olhada
              nas outras.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              Ver todos os produtos
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
