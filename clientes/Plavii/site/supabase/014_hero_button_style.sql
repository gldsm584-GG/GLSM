-- Rode no SQL Editor do Supabase depois do 013_hero_content_position.sql
-- O Hero volta a ter só um botão flutuante (sem título/texto solto nem
-- posição arrastável) — a imagem já vem pronta de fora, com tudo
-- desenhado. Aqui só a cor da letra e do fundo do botão são editáveis.

alter table hero_slides
  add column if not exists button_text_color text,
  add column if not exists button_bg_color text;
