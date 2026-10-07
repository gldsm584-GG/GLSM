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

✅ Publicado em produção em 2026-10-06:
https://bibi-perfumes-glsmteste.vercel.app (projeto Vercel `bibi-perfumes`,
time `glsmteste`, deploy automático a cada push — esse é o domínio que
sempre segue a produção, usa ele pra divulgar. `bibiperfumesimportados.vercel.app`
também existe mas é um alias fixo numa versão — se usar ele, precisa
re-apontar manualmente a cada deploy). Supabase próprio
rodando (schema + os 12 produtos seedados), login de admin testado e
funcionando com `gldsm584@gmail.com`.

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
- Admin login: email do Gustavo (`gldsm584@gmail.com`) — confirmado e
  testado em 2026-10-06, funcionando

## Pendências antes de divulgar

- [x] Criar o projeto Supabase novo e rodar `site/supabase/schema.sql`
      — feito em 2026-10-06 (projeto `pmacqaerzglwcljxifxo`)
- [x] Criar o projeto Vercel novo e publicar — feito em 2026-10-06
      (Root Directory corrigido pra `clientes/Bibi-Perfumes-Importados/site`,
      proteção SSO desligada pra ficar público)
- [x] Número de WhatsApp real da loja — `61 9917-3630`, atualizado em
      2026-10-06 em `src/lib/whatsapp.ts`
- [ ] Fotos reais dos 12 perfumes (hoje todos usam `/sem-imagem.svg` —
      sobe pelo admin em Produtos)
- [ ] Logo real da Bibi Perfumes

## Site

Fica em `clientes/Bibi-Perfumes-Importados/site/` — projeto Next.js
independente (TypeScript + Tailwind + Supabase), reaproveitando os
padrões já validados no site da Plavii (`clientes/Plavii/site/`), mas
com banco e deploy próprios — não compartilha nada com a Plavii.
