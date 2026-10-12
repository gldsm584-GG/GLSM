# Geocar

> Projeto criado em 2026-10-12. Pasta dedicada — instruções aqui sobrescrevem as da raiz quando relevantes.

## Sobre

Site de loja de carros pra Geocar Automóveis (Sobradinho/DF): vitrine dos
carros, painel de admin onde a loja edita o estoque (descrição e fotos) e
CRM com funil de negociação — tudo em Supabase.

## Tipo

Cliente novo — prospecção por iniciativa própria (como a Ciapel).

## Entregas previstas

- Site: vitrine pública + painel admin + CRM, tudo no mesmo app (`site/`)

## Onde salvar o que

- Briefings e contexto: nessa pasta na raiz
- Código do site: `site/`
- Logo e fotos da loja/carros: nessa pasta (nunca em `identidade/` da raiz)
- Estoque levantado: `estoque.md`. Fotos dos carros em `fotos/<carro>/`

## Contexto que herda da raiz

Esse projeto herda automaticamente o tom de voz, marca e contexto do negócio definidos em `_memoria/` e `identidade/` da raiz. Não duplicar essas informações aqui.

## Específico desse projeto

- Supabase e projeto Vercel próprios — não compartilhar nada com Plavii ou
  Bibi
- Os WhatsApp no site são números reais da loja (George e Diógenes) — não
  testar o botão sem avisar
- Admin pela função `is_admin()` no banco desde o começo (lição da Bibi:
  `clientes/Bibi-Perfumes-Importados/site/supabase/002_admin_bibiperfumes.sql`)
