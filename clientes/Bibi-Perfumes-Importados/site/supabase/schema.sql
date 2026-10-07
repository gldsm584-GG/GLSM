-- ============================================================
-- Bibi Perfumes Importados — schema completo (projeto Supabase novo)
-- Rode esse arquivo inteiro no SQL Editor do Supabase.
--
-- ANTES DE RODAR: troque TROCAR-EMAIL-ADMIN@exemplo.com pelo email que
-- vai logar como admin (6 ocorrências abaixo). Sugestão: gldsm584@gmail.com
-- (confirmar com o Gustavo) — depois disso, troque também em
-- src/lib/admin.ts (ADMIN_EMAILS).
-- ============================================================

-- PRODUCTS -----------------------------------------------------
create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  volume_ml int not null default 100,
  price numeric(10,2) not null,
  old_price numeric(10,2),
  image text not null default '/sem-imagem.svg',
  images text[] not null default '{}',
  description text,
  notes_top text,
  notes_heart text,
  notes_base text,
  created_at timestamptz default now()
);

alter table products enable row level security;

create policy "Produtos são públicos para leitura"
  on products for select using (true);

create policy "Admin gerencia produtos"
  on products for all
  using (auth.jwt() ->> 'email' in ('TROCAR-EMAIL-ADMIN@exemplo.com'))
  with check (auth.jwt() ->> 'email' in ('TROCAR-EMAIL-ADMIN@exemplo.com'));

-- ORDERS (venda manual, lançada pelo admin após fechar no WhatsApp) -----
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'confirmado',
  total numeric(10,2) not null,
  customer_name text not null,
  phone text not null,
  notes text,
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

create policy "Admin vê todos os pedidos" on orders for select
  using (auth.jwt() ->> 'email' in ('TROCAR-EMAIL-ADMIN@exemplo.com'));
create policy "Admin cria pedido manual" on orders for insert
  with check (auth.jwt() ->> 'email' in ('TROCAR-EMAIL-ADMIN@exemplo.com'));
create policy "Admin atualiza pedidos" on orders for update
  using (auth.jwt() ->> 'email' in ('TROCAR-EMAIL-ADMIN@exemplo.com'))
  with check (auth.jwt() ->> 'email' in ('TROCAR-EMAIL-ADMIN@exemplo.com'));
create policy "Admin vê itens de todos os pedidos" on order_items for select
  using (auth.jwt() ->> 'email' in ('TROCAR-EMAIL-ADMIN@exemplo.com'));
create policy "Admin cria itens de pedido manual" on order_items for insert
  with check (auth.jwt() ->> 'email' in ('TROCAR-EMAIL-ADMIN@exemplo.com'));

-- STORAGE (fotos de produto) --------------------------------
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

create policy "Admin envia fotos de produto" on storage.objects for insert
  with check (bucket_id = 'produtos' and auth.jwt() ->> 'email' in ('TROCAR-EMAIL-ADMIN@exemplo.com'));
create policy "Admin troca fotos de produto" on storage.objects for update
  using (bucket_id = 'produtos' and auth.jwt() ->> 'email' in ('TROCAR-EMAIL-ADMIN@exemplo.com'));
create policy "Admin apaga fotos de produto" on storage.objects for delete
  using (bucket_id = 'produtos' and auth.jwt() ->> 'email' in ('TROCAR-EMAIL-ADMIN@exemplo.com'));
create policy "Fotos de produto são públicas para leitura" on storage.objects for select
  using (bucket_id = 'produtos');

-- SEED: catálogo inicial (12 perfumes, 100ml, sem foto real ainda) --------
insert into products (id, slug, name, volume_ml, price, notes_top, notes_heart, notes_base, image, images) values
  ('delilah-blanc','delilah-blanc','Delilah Blanc',100,290.00,'bergamota, pêssego branco, mandarina','flor de laranjeira, vetiver','almíscar, baunilha','/sem-imagem.svg',array['/sem-imagem.svg']),
  ('musamam','musamam','Musamam',100,350.00,'mandarina italiana, lavanda, açafrão','gerânio, cedro, madeira de âmbar','incenso, akigalawood, ládano','/sem-imagem.svg',array['/sem-imagem.svg']),
  ('atheeri','atheeri','Atheeri',100,450.00,'flor de maracujá, gota de orvalho','orquídea, jasmim','baunilha, madeira de âmbar','/sem-imagem.svg',array['/sem-imagem.svg']),
  ('manaal','manaal','Manaal',100,320.00,'lavanda, bergamota','pistache, amêndoa, flores brancas','baunilha, cacau, sândalo','/sem-imagem.svg',array['/sem-imagem.svg']),
  ('noble-blush','noble-blush','Noble Blush',100,250.00,'leite de rosas','merengue, amêndoa','baunilha, almíscar, sândalo','/sem-imagem.svg',array['/sem-imagem.svg']),
  ('infinity-gold','infinity-gold','Infinity Gold',100,430.00,'pera, lavanda, rosa','ylang-ylang, jasmim','baunilha, almíscar, musgo','/sem-imagem.svg',array['/sem-imagem.svg']),
  ('vanilla-voyage','vanilla-voyage','Vanilla Voyage',100,430.00,'caramelo, manteiga','mel, fava tonka, jasmim','baunilha, âmbar, almíscar','/sem-imagem.svg',array['/sem-imagem.svg']),
  ('fayora','fayora','Fayora',100,320.00,'maracujá, rosa','íris, jasmim, íris-do-vale, violeta','sândalo, cedro, baunilha, almíscar','/sem-imagem.svg',array['/sem-imagem.svg']),
  ('so-candid-rouge','so-candid-rouge','So Candid Rouge',100,250.00,'bergamota, pera, mandarina','jasmim, rosa, peônia','almíscar, cedro, âmbar','/sem-imagem.svg',array['/sem-imagem.svg']),
  ('yum-yum','yum-yum','Yum Yum',100,340.00,'frutas silvestres, cereja, laranja, bergamota','rosa, flores brancas, baunilha','notas atalcadas, almíscar, âmbar','/sem-imagem.svg',array['/sem-imagem.svg']),
  ('fakhar-rose','fakhar-rose','Fakhar Rose',100,260.00,'frutas, lírio, romã, aldeídos','tuberosa, jasmim, gardênia, rosa, peônia','baunilha, almíscar branco, sândalo, âmbar','/sem-imagem.svg',array['/sem-imagem.svg']),
  ('durrat-al-aroos','durrat-al-aroos','Durrat Al Aroos',100,260.00,'almíscar branco, nagarmota','baunilha, cardamomo, açafrão','madeira guaiac, cumarina','/sem-imagem.svg',array['/sem-imagem.svg'])
on conflict (id) do nothing;
