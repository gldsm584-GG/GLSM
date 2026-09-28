-- Rode no SQL Editor do Supabase depois do 009_site_storage.sql
-- Troca o Hero de "uma imagem só" pra carrossel: o admin pode adicionar
-- vários slides e navegar entre eles com setinha na home. Reaproveita o
-- bucket 'site' já criado no 009 pra guardar as imagens.

create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  created_at timestamptz default now()
);

alter table hero_slides enable row level security;

create policy "Slides do Hero são públicos para leitura"
  on hero_slides for select
  using (true);

create policy "Admin gerencia os slides do Hero"
  on hero_slides for all
  using (auth.jwt() ->> 'email' in ('gustest@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('gustest@gmail.com'));

-- A home não usa mais uma imagem única de Hero — limpa o campo antigo
-- (era do site_pages, da versão anterior desse recurso).
update site_pages set image_url = null where slug = 'hero';
