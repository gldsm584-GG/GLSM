-- Rode no SQL Editor do Supabase depois do 003_admin.sql
-- Conteúdo da loja que o admin edita direto no site (sem entrar no painel):
-- a imagem do Hero da home e duas páginas em branco (rodapé).
--
-- Nota: a policy de admin abaixo usa o email gustest@gmail.com — é o que
-- está valendo de verdade no banco hoje (as policies antigas do
-- 003_admin.sql/004_storage.sql foram escritas com
-- gustavo.teste.plavii@gmail.com, mas o admin real logado é gustest@gmail.com
-- — os dois arquivos ficaram desatualizados em algum momento).

create table if not exists site_pages (
  slug text primary key,
  title text not null default '',
  content text not null default '',
  image_url text,
  updated_at timestamptz default now()
);

alter table site_pages enable row level security;

create policy "Conteúdo do site é público para leitura"
  on site_pages for select
  using (true);

create policy "Admin edita o conteúdo do site"
  on site_pages for all
  using (auth.jwt() ->> 'email' in ('gustest@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('gustest@gmail.com'));

insert into site_pages (slug, title, content, image_url) values
  ('hero', '', '', null),
  ('pagina-1', 'Página 1', '', null),
  ('pagina-2', 'Página 2', '', null)
on conflict (slug) do nothing;
