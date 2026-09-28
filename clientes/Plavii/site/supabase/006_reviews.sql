-- Rode no SQL Editor do Supabase depois do 003_admin.sql
-- Cria a tabela de avaliações de produto: nota (1 a 5), comentário e foto
-- opcionais. Qualquer pessoa lê; só o dono da conta cria/edita/apaga a
-- própria avaliação. Uma avaliação por cliente por produto (ela pode editar
-- a mesma avaliação depois, não cria uma nova).

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  photo_url text,
  created_at timestamptz default now(),
  unique (product_id, user_id)
);

alter table reviews enable row level security;

create policy "Avaliações são públicas para leitura"
  on reviews for select
  using (true);

create policy "Cliente cria a própria avaliação"
  on reviews for insert
  with check (auth.uid() = user_id);

create policy "Cliente edita a própria avaliação"
  on reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Cliente apaga a própria avaliação"
  on reviews for delete
  using (auth.uid() = user_id);
