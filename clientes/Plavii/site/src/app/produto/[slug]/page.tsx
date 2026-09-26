import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import FavoriteButton from "@/components/FavoriteButton";
import TrackView from "@/components/TrackView";
import LineIcon from "@/components/LineIcon";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, sameCategory } from "@/lib/categories";
import {
  discountPercent,
  formatPrice,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const off = discountPercent(product);
  const related = await getRelatedProducts(product);
  const category = CATEGORIES.find((c) => sameCategory(product.category, c));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <TrackView productId={product.id} />
      <nav className="mb-5 text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand">
          Início
        </Link>
        <span className="mx-2">/</span>
        {category && (
          <>
            <Link href={`/categoria/${category.slug}`} className="hover:text-brand">
              {category.nome}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:p-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,26rem)_1fr] md:gap-10">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-lg md:max-w-none">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 416px"
              priority
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              {category && (
                <Link
                  href={`/categoria/${category.slug}`}
                  className="flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand hover:underline"
                >
                  <LineIcon name={category.icon} className="h-3.5 w-3.5" />
                  {category.nome}
                </Link>
              )}
              <FavoriteButton productId={product.id} className="ml-auto" />
            </div>

            <h1 className="text-xl font-bold leading-snug text-neutral-800 md:text-2xl">
              {product.name}
            </h1>

            <div>
              {product.oldPrice && (
                <p className="text-sm text-neutral-400 line-through">
                  {formatPrice(product.oldPrice)}
                </p>
              )}
              <div className="flex items-center gap-2">
                <p className="text-3xl font-normal text-neutral-900">
                  {formatPrice(product.price)}
                </p>
                {off && off < 100 && (
                  <span className="text-sm font-semibold text-green-600">{off}% OFF</span>
                )}
              </div>
            </div>

            <div className="mt-2 max-w-xs rounded-lg border border-neutral-200 p-4">
              <AddToCart productId={product.id} />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:p-6">
        <h2 className="mb-2 text-lg font-bold text-neutral-800">Sobre o produto</h2>
        <p className="max-w-3xl leading-relaxed text-neutral-600">{product.description}</p>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-7 w-1.5 rounded-full bg-brand" />
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-800">
              Você também pode gostar
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
