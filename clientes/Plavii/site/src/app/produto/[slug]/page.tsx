import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import FavoriteButton from "@/components/FavoriteButton";
import TrackView from "@/components/TrackView";
import LineIcon from "@/components/LineIcon";
import ProductCard from "@/components/ProductCard";
import ProductInlineEditor from "@/components/ProductInlineEditor";
import ProductReviews from "@/components/ProductReviews";
import { getCategories, sameCategory } from "@/lib/categories";
import {
  discountPercent,
  formatPrice,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";

// Mesma razão do page.tsx da home: sem isso, o Next.js congela a página no
// build e edições do admin (preço, promoção, avaliações) não aparecem até
// o próximo deploy.
export const dynamic = "force-dynamic";

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
  const categories = await getCategories().catch(() => []);
  const category = categories.find((c) => sameCategory(product.category, c));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <TrackView productId={product.id} />
      <ProductInlineEditor product={product} />
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
          {/* Só a foto, isolada numa moldura própria */}
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 md:max-w-none">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 416px"
              priority
            />
            {off && off < 100 && (
              <span className="absolute left-3 top-3 rounded-full bg-green-600 px-2.5 py-1 text-xs font-bold text-white">
                {off}% OFF
              </span>
            )}
          </div>

          {/* Categoria, título, descrição, preço e compra — tudo junto, estilo Mercado Livre */}
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

            <p className="leading-relaxed text-neutral-600">{product.description}</p>

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

      <ProductReviews productId={product.id} />

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
