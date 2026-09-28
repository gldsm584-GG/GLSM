-- Rode no SQL Editor do Supabase depois do 015_hero_multi_buttons.sql
-- Deixa o admin escolher à mão quais produtos aparecem em "Ofertas
-- relâmpago" na home, em vez de sempre pegar os 4 com maior desconto
-- automaticamente. Sem nenhum produto marcado, a home continua do jeito
-- de sempre (desconto automático).

alter table products
  add column if not exists is_promo boolean not null default false;
