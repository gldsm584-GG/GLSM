-- Rode no SQL Editor do Supabase depois do 012_hero_button_link.sql
-- Tira os produtos soltos do Hero (o admin vai preferir levar o clique
-- pra um produto via "Pra onde o botão leva?") e adiciona a posição
-- livre do bloco de título/texto/botão — null significa "posição
-- padrão" (o visual de sempre, sem precisar o admin mexer em nada).

alter table hero_slides
  add column if not exists content_x numeric,
  add column if not exists content_y numeric;
