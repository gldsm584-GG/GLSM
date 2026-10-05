-- Rode no SQL Editor do Supabase depois do 020_shipping.sql
-- Permite cadastrar mais de uma foto por produto (galeria na página do
-- produto, estilo Mercado Livre). A coluna "image" continua sendo a capa
-- (usada nos cards, carrinho, busca, hero etc). "images" guarda a lista
-- completa de fotos, incluindo a capa na posição 0.

alter table products
  add column if not exists images text[] not null default '{}';

update products set images = array[image] where images = '{}';
