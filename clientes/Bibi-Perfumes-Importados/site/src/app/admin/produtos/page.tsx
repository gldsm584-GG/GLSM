import ProductsPanel from "@/components/admin/ProductsPanel";

export default function AdminProdutosPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark">Produtos</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-500">
        Cadastre, edite e remova os perfumes da loja.
      </p>
      <ProductsPanel />
    </div>
  );
}
