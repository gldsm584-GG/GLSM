import AdminMenu from "@/components/AdminMenu";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getCategories, type Category } from "@/lib/categories";
import { getHeroSlides, type HeroSlide } from "@/lib/hero";
import { discountPercent, getAllProducts } from "@/lib/products";
import { getSitePage } from "@/lib/site-content";

// Sem isso, o Next.js congela essa página como estática no build e só
// atualiza no próximo deploy — mudanças feitas no admin (produtos, ofertas,
// hero, categorias) não apareceriam até o site ser republicado.
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getAllProducts();
  // Se o hero_slides ainda não existir (migração não rodada), a home
  // continua funcionando normal com o Hero padrão.
  const heroSlides = await getHeroSlides().catch(() => [] as HeroSlide[]);
  // Idem pra linha "ofertas" do site_pages: sem ela, usa os textos padrão.
  const ofertasPage = await getSitePage("ofertas").catch(() => null);
  // Idem pra categories: sem a migração 018 rodada, o painel de categorias
  // fica vazio, mas o resto da home continua funcionando.
  const categories = await getCategories().catch(() => [] as Category[]);

  // Vitrine do hero padrão: produtos com foto e desconto que faça sentido
  const destaques = products
    .filter((p) => p.image !== "/sem-imagem.svg" && p.price > 0)
    .filter((p) => {
      const off = discountPercent(p);
      return off !== null && off < 90;
    })
    .slice(0, 3);

  // O admin pode escolher à mão quais produtos entram aqui (painel
  // "Gerenciar Ofertas"). Sem nenhum marcado, cai pro automático: os
  // produtos com maior desconto.
  const promoPicks = products.filter((p) => p.isPromo);
  const ofertas =
    promoPicks.length > 0
      ? promoPicks
      : products
          .filter((p) => p.price > 0 && discountPercent(p) !== null && discountPercent(p)! < 90)
          .sort((a, b) => (discountPercent(b) ?? 0) - (discountPercent(a) ?? 0))
          .slice(0, 4);

  return (
    <div>
      <Hero slides={heroSlides} destaques={destaques} />
      <AdminMenu
        heroSlides={heroSlides}
        products={products}
        ofertasPage={ofertasPage}
        categories={categories}
      />

      {ofertas.length > 0 && (
        <section className="mx-auto mt-14 max-w-6xl px-4">
          <div className="rounded-3xl bg-gradient-to-r from-brand to-brand-light p-5 md:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-white/70">
                  {ofertasPage?.content || "Por tempo limitado"}
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                  {ofertasPage?.title || "Ofertas relâmpago"}
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
