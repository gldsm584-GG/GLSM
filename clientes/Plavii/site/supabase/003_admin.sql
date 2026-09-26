-- Rode no SQL Editor do Supabase depois do 002_orders.sql
-- Libera cadastrar/editar/apagar produtos e ver/gerenciar TODOS os pedidos
-- só pra email(s) de admin. Pra adicionar mais admins depois, inclui o
-- email na lista `in (...)` das duas policies abaixo.

create policy "Admin gerencia produtos"
  on products for all
  using (auth.jwt() ->> 'email' in ('gustavo.teste.plavii@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('gustavo.teste.plavii@gmail.com'));

create policy "Admin vê todos os pedidos"
  on orders for select
  using (auth.jwt() ->> 'email' in ('gustavo.teste.plavii@gmail.com'));

create policy "Admin atualiza pedidos"
  on orders for update
  using (auth.jwt() ->> 'email' in ('gustavo.teste.plavii@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('gustavo.teste.plavii@gmail.com'));

create policy "Admin vê itens de todos os pedidos"
  on order_items for select
  using (auth.jwt() ->> 'email' in ('gustavo.teste.plavii@gmail.com'));
