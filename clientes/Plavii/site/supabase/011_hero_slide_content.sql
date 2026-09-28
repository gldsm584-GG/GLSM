-- Rode no SQL Editor do Supabase depois do 010_hero_slides.sql
-- Cada Hero pode ter, além da imagem: título, texto, botão e até 3
-- produtos "soltos" em cima da imagem (posição livre, em % da imagem).
-- Tudo opcional — um Hero pode continuar sendo só a imagem.

alter table hero_slides
  add column if not exists title text,
  add column if not exists subtitle text,
  add column if not exists button_text text,
  add column if not exists products jsonb not null default '[]'::jsonb;

alter table hero_slides
  drop constraint if exists hero_slides_products_max3;

alter table hero_slides
  add constraint hero_slides_products_max3
  check (jsonb_array_length(products) <= 3);
