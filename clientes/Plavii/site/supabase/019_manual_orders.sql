-- Rode no SQL Editor do Supabase.
-- Libera o admin lançar venda manual (fechada no WhatsApp, sem conta de
-- cliente nem endereço salvo no site). user_id e endereço viram opcionais;
-- novas policies de insert só pro email admin.

alter table orders alter column user_id drop not null;
alter table orders alter column address drop not null;
alter table orders alter column city drop not null;
alter table orders alter column cep drop not null;

create policy "Admin cria pedido manual"
  on orders for insert
  with check (auth.jwt() ->> 'email' in ('gustest@gmail.com'));

create policy "Admin cria itens de pedido manual"
  on order_items for insert
  with check (auth.jwt() ->> 'email' in ('gustest@gmail.com'));
