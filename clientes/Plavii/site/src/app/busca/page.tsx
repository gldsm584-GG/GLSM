import Link from "next/link";
import LineIcon from "@/components/LineIcon";
import ProductCard from "@/components/ProductCard";
import { getCategories } from "@/lib/categories";
import { getAllProducts } from "@/lib/products";
import { searchProducts } from "@/lib/search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const term = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const results = term ? searchProducts(await getAllProducts(), term) : [];
  const categories = await getCategories().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-800">
          {term ? <>Resultados para &ldquo;{term}&rdquo;</> : "Buscar produtos"}
        </h1>
        {term && (
          <p className="mt-1 text-sm text-neutral-500">
            {results.length} {results.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
          <LineIcon name="search" className="mx-auto h-12 w-12 text-neutral-300" />
          <p className="mt-4 text-lg font-bold text-neutral-800">
            {term ? "Não encontramos nada com esse termo" : "Digite algo na barra de busca"}
          </p>
          <p className="mt-1 text-neutral-500">
            {term
              ? "Confira a escrita ou tente uma palavra mais geral. Você também pode navegar por categoria:"
              : "Pesquise por nome do produto ou categoria."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {categories.slice(0, 8).map((c) => (
              <Link
                key={c.slug}
                href={`/categoria/${c.slug}`}
                className="flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-brand/20"
              >
                <LineIcon name={c.icon} className="h-4 w-4" />
                {c.nome}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
