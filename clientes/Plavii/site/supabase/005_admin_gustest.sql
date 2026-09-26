-- Rode no SQL Editor do Supabase (depois do 003 e do 004).
-- Recria as policies de admin deixando só gustest@gmail.com como admin.
-- Pra adicionar mais admins depois, inclui o email nas listas `in (...)` abaixo.

-- Produtos e pedidos
drop policy if exists "Admin gerencia produtos" on products;
drop policy if exists "Admin vê todos os pedidos" on orders;
drop policy if exists "Admin atualiza pedidos" on orders;
drop policy if exists "Admin vê itens de todos os pedidos" on order_items;

create policy "Admin gerencia produtos"
  on products for all
  using (auth.jwt() ->> 'email' in ('gustest@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('gustest@gmail.com'));

create policy "Admin vê todos os pedidos"
  on orders for select
  using (auth.jwt() ->> 'email' in ('gustest@gmail.com'));

create policy "Admin atualiza pedidos"
  on orders for update
  using (auth.jwt() ->> 'email' in ('gustest@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('gustest@gmail.com'));

create policy "Admin vê itens de todos os pedidos"
  on order_items for select
  using (auth.jwt() ->> 'email' in ('gustest@gmail.com'));

-- Fotos de produto (storage)
drop policy if exists "Admin envia fotos de produto" on storage.objects;
drop policy if exists "Admin troca fotos de produto" on storage.objects;
drop policy if exists "Admin apaga fotos de produto" on storage.objects;

create policy "Admin envia fotos de produto"
  on storage.objects for insert
  with check (
    bucket_id = 'produtos'
    and auth.jwt() ->> 'email' in ('gustest@gmail.com')
  );

create policy "Admin troca fotos de produto"
  on storage.objects for update
  using (
    bucket_id = 'produtos'
    and auth.jwt() ->> 'email' in ('gustest@gmail.com')
  );

create policy "Admin apaga fotos de produto"
  on storage.objects for delete
  using (
    bucket_id = 'produtos'
    and auth.jwt() ->> 'email' in ('gustest@gmail.com')
  );
