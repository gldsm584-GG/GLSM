# Bibi Perfumes Importados

> Cliente em andamento (irmã do Gustavo). Criado em 2026-10-06.

## Sobre

Loja de perfumes árabes/importados. Catálogo inicial com 12 perfumes
(100ml), levantado a partir de um print de catálogo que a Bibi usa hoje
(nome, preço e notas olfativas de topo/coração/fundo de cada um).

## Diferencial do produto

Cada perfume tem "pirâmide olfativa" (notas de topo, coração e fundo) —
isso é o que diferencia esse catálogo de um e-commerce genérico, então a
página do produto mostra isso em destaque, com ícone pra cada camada.

## Identidade visual

- Paleta rosa/vinho/dourado, inspirada no print de catálogo que a Bibi
  usa hoje (fundo rosa/magenta em gradiente, título serifado vinho,
  detalhes dourados, flores decorativas)
- Cores (`src/app/globals.css`): `--brand #c2185b` (framboesa/magenta),
  `--brand-dark #880e4f` (vinho), `--brand-light #f48fb1` (rosa claro),
  `--accent #d4af37` (dourado)
- Fonte serifada (Playfair Display) pro título do hero, Inter pro resto
- Logo: ainda não definido — por enquanto o nome "Bibi Perfumes" aparece
  em texto no header/footer. Quando a Bibi mandar um logo de verdade,
  colocar aqui (`clientes/Bibi-Perfumes-Importados/logo.png`) — nunca em
  `identidade/` (reservada pra marca pessoal do Gustavo)

## Status

Em desenvolvimento — site sendo construído (2026-10-06), ainda não
publicado.

## Decisões de escopo (2026-10-06)

- Sem login de cliente: só catálogo + carrinho + "Finalizar no
  WhatsApp" — mais simples e bate com o pedido original (fluxo direto
  pro WhatsApp)
- Sem pagamento online, sem frete — tudo combinado por fora, pelo
  WhatsApp
- Admin consegue: cadastrar/editar/apagar produtos (com fotos, volume,
  notas olfativas) e registrar vendas manuais fechadas no WhatsApp
  (mesmo painel kanban de pedidos que a Plavii tem na fase WhatsApp-only)
- Sem categorias (só existe "perfumes" — criar uma tabela de categoria
  seria overbuild pra esse catálogo)
- Infra (Supabase + Vercel) na conta do Gustavo por enquanto, mesmo
  esquema usado com a Plavii — transferir pra Bibi se o negócio decolar
- Admin login: email do Gustavo por enquanto (confirmar se é
  `gldsm584@gmail.com` ou se prefere um email dedicado, como fez com a
  Plavii usando `gustest@gmail.com`)

## Pendências antes de divulgar

- [ ] Número de WhatsApp real da loja (`src/lib/whatsapp.ts`,
      `WHATSAPP_NUMBER` — está com placeholder)
- [ ] Fotos reais dos 12 perfumes (hoje todos usam `/sem-imagem.svg` —
      sobe pelo admin em Produtos)
- [ ] Logo real da Bibi Perfumes
- [ ] Criar o projeto Supabase novo e rodar `site/supabase/schema.sql`
- [ ] Criar o projeto Vercel novo (Root Directory =
      `clientes/Bibi-Perfumes-Importados/site`) e publicar

## Site

Fica em `clientes/Bibi-Perfumes-Importados/site/` — projeto Next.js
independente (TypeScript + Tailwind + Supabase), reaproveitando os
padrões já validados no site da Plavii (`clientes/Plavii/site/`), mas
com banco e deploy próprios — não compartilha nada com a Plavii.
