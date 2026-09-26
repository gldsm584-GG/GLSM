import ProductsPanel from "@/components/admin/ProductsPanel";

export default function AdminProdutosPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800">Produtos</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-500">
        Cadastre, edite e remova os produtos da loja.
      </p>
      <ProductsPanel />
    </div>
  );
}
