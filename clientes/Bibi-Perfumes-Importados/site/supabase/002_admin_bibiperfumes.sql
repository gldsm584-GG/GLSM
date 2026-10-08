-- ============================================================
-- Troca o admin da loja pra bibiperfumes@gmail.com (2026-10-07)
--
-- ANTES DE RODAR: crie a conta bibiperfumes@gmail.com no Supabase
-- (Authentication → Users → Add user → Create new user, com
-- "Auto Confirm User" marcado). Se o email virar admin antes de a conta
-- existir, qualquer pessoa poderia se cadastrar com ele no site.
--
-- O email do admin agora fica num lugar só: a função is_admin() abaixo.
-- Pra trocar de novo no futuro, é só mudar a lista dentro dela (e em
-- src/lib/admin.ts) e rodar de novo o "create or replace function".
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') in ('bibiperfumes@gmail.com');
$$;

-- PRODUCTS ----------------------------------------------------
drop policy if exists "Admin gerencia produtos" on products;
create policy "Admin gerencia produtos"
  on products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ORDERS / ORDER_ITEMS ------------------------------------------
drop policy if exists "Admin vê todos os pedidos" on orders;
create policy "Admin vê todos os pedidos" on orders for select
  using (public.is_admin());

drop policy if exists "Admin cria pedido manual" on orders;
create policy "Admin cria pedido manual" on orders for insert
  with check (public.is_admin());

drop policy if exists "Admin atualiza pedidos" on orders;
create policy "Admin atualiza pedidos" on orders for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin vê itens de todos os pedidos" on order_items;
create policy "Admin vê itens de todos os pedidos" on order_items for select
  using (public.is_admin());

drop policy if exists "Admin cria itens de pedido manual" on order_items;
create policy "Admin cria itens de pedido manual" on order_items for insert
  with check (public.is_admin());

-- STORAGE (fotos de produto) ------------------------------------
drop policy if exists "Admin envia fotos de produto" on storage.objects;
create policy "Admin envia fotos de produto" on storage.objects for insert
  with check (bucket_id = 'produtos' and public.is_admin());

drop policy if exists "Admin troca fotos de produto" on storage.objects;
create policy "Admin troca fotos de produto" on storage.objects for update
  using (bucket_id = 'produtos' and public.is_admin());

drop policy if exists "Admin apaga fotos de produto" on storage.objects;
create policy "Admin apaga fotos de produto" on storage.objects for delete
  using (bucket_id = 'produtos' and public.is_admin());
