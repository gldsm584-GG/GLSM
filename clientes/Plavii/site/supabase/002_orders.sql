-- Rode no SQL Editor do Supabase depois do schema.sql
-- Cria as tabelas de pedido, com segurança: cada pessoa só vê/cria os próprios pedidos.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  status text not null default 'pendente',
  total numeric(10,2) not null,
  customer_name text not null,
  address text not null,
  city text not null,
  cep text not null,
  phone text not null,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null references products(id),
  product_name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null
);

alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Usuário vê só os próprios pedidos"
  on orders for select
  using (auth.uid() = user_id);

create policy "Usuário cria só pedido próprio"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "Itens visíveis se o pedido é do usuário"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Itens inseridos se o pedido é do usuário"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
