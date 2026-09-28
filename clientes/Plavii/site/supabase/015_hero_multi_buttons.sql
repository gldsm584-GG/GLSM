-- Rode no SQL Editor do Supabase depois do 014_hero_button_style.sql
-- O Hero passa a suportar vários botões por slide, cada um numa posição
-- livre sobre a imagem (arrastável no editor) — antes só dava pra ter um
-- botão fixo no canto inferior esquerdo.

alter table hero_slides
  add column if not exists buttons jsonb not null default '[]'::jsonb;

-- Migra o botão único que já existia pra dentro do array novo, na mesma
-- posição visual de sempre (canto inferior esquerdo).
update hero_slides
set buttons = jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid()::text,
    'text', button_text,
    'link', button_link,
    'text_color', coalesce(button_text_color, '#0f3a68'),
    'bg_color', coalesce(button_bg_color, '#ffc83d'),
    'x', 12,
    'y', 88
  )
)
where button_text is not null and jsonb_array_length(buttons) = 0;
