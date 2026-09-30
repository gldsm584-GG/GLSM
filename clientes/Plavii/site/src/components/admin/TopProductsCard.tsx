import { TOP_PRODUCT_BAR_COLOR } from "@/lib/chart-colors";
import { formatPrice } from "@/lib/products";
import type { TopProduct } from "@/lib/stats";

// Ranking em lista (com barrinha de magnitude) em vez de mais um gráfico —
// mais fácil de ler "o que repor" do que uma terceira barra competindo
// atenção com os outros dois gráficos da mesma tela.
export default function TopProductsCard({ products }: { products: TopProduct[] }) {
  const maxRevenue = Math.max(1, ...products.map((p) => p.revenue));

  return (
    <div className="rounded-2xl bg-white p-5">
      <h2 className="font-semibold text-neutral-800">Mais vendidos</h2>

      {products.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-400">Nenhuma venda paga nesse período.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {products.map((product, i) => (
            <li key={product.name}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate text-neutral-700">
                  <span className="mr-2 text-neutral-400">{i + 1}.</span>
                  {product.name}
                </span>
                <span className="shrink-0 text-xs text-neutral-400">{product.quantity}x</span>
                <span className="shrink-0 font-semibold text-neutral-800">
                  {formatPrice(product.revenue)}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(product.revenue / maxRevenue) * 100}%`,
                    backgroundColor: TOP_PRODUCT_BAR_COLOR,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
