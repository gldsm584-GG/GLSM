-- Rode no SQL Editor do Supabase depois do 017_ofertas_content.sql
-- Categorias deixam de ser uma lista fixa no código e viram uma tabela —
-- o admin passa a poder adicionar e apagar direto pelo painel "Editar
-- site". Essa migração só cria a tabela vazia: as categorias que já
-- existiam são recriadas pelo próprio painel (Editar site > Categorias),
-- não por um insert direto aqui.

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text unique not null,
  icon text not null,
  cor text not null,
  created_at timestamptz default now()
);

alter table categories enable row level security;

create policy "Categorias são públicas para leitura"
  on categories for select
  using (true);

create policy "Admin gerencia categorias"
  on categories for all
  using (auth.jwt() ->> 'email' in ('gustest@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('gustest@gmail.com'));
