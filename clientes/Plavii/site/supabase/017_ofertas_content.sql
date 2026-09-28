-- Rode no SQL Editor do Supabase depois do 016_products_promo.sql
-- Deixa o admin editar o selo e o título da seção "Ofertas relâmpago"
-- da home, reaproveitando a tabela site_pages já usada pro Hero e pelas
-- páginas do rodapé.

insert into site_pages (slug, title, content, image_url) values
  ('ofertas', 'Ofertas relâmpago', 'Por tempo limitado', null)
on conflict (slug) do nothing;
