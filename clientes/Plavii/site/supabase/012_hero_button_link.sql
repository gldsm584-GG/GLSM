-- Rode no SQL Editor do Supabase depois do 011_hero_slide_content.sql
-- O botão do Hero agora pode levar pra onde o admin quiser (categoria,
-- produto, link externo etc), não só pra vitrine da home.

alter table hero_slides
  add column if not exists button_link text;
