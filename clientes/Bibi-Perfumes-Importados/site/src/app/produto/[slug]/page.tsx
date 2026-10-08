import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import FavoriteButton from "@/components/FavoriteButton";
import LineIcon from "@/components/LineIcon";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import TrackView from "@/components/TrackView";
import {
  discountPercent,
  formatPrice,
  getOtherProducts,
  getProductBySlug,
} from "@/lib/products";

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
  const others = await getOtherProducts(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <TrackView productId={product.id} />
      <nav className="mb-5 text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand">
          Início
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:p-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,26rem)_1fr] md:gap-10">
          <ProductGallery
            images={product.images}
            alt={product.name}
            discountLabel={off && off < 100 ? `${off}% OFF` : null}
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <span className="w-fit rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand-dark">
                {product.volumeMl}ml
              </span>
              <FavoriteButton productId={product.id} className="ml-auto" />
            </div>

            <h1 className="font-serif text-2xl font-bold leading-snug text-brand-dark md:text-3xl">
              {product.name}
            </h1>

            {product.description && (
              <p className="leading-relaxed text-neutral-600">{product.description}</p>
            )}

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
                  <span className="text-sm font-semibold text-brand">{off}% OFF</span>
                )}
              </div>
            </div>

            {(product.notesTop || product.notesHeart || product.notesBase) && (
              <div className="flex flex-col gap-2 rounded-lg border border-brand/20 bg-brand/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
                  Pirâmide Olfativa
                </p>
                {product.notesTop && (
                  <div className="flex items-start gap-2 text-sm text-neutral-700">
                    <LineIcon name="droplet" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>
                      <strong>Topo:</strong> {product.notesTop}
                    </span>
                  </div>
                )}
                {product.notesHeart && (
                  <div className="flex items-start gap-2 text-sm text-neutral-700">
                    <LineIcon name="heart" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>
                      <strong>Coração:</strong> {product.notesHeart}
                    </span>
                  </div>
                )}
                {product.notesBase && (
                  <div className="flex items-start gap-2 text-sm text-neutral-700">
                    <LineIcon name="roots" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>
                      <strong>Fundo:</strong> {product.notesBase}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-2 max-w-xs rounded-lg border border-neutral-200 p-4">
              <AddToCart product={product} />
            </div>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <section className="mt-16">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-7 w-1.5 rounded-full bg-brand" />
            <h2 className="text-2xl font-extrabold tracking-tight text-brand-dark">
              Você também pode gostar
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {others.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
