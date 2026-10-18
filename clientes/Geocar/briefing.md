# Geocar

> Prospecção (iniciativa própria do Gustavo). Criado em 2026-10-12.

## Sobre a loja

Levantado no Instagram e no Linktree em 2026-10-12:

- **Nome:** GEOCAR AUTOMÓVEIS no Instagram, "GeoCar Veículos" no Linktree
  — confirmar qual é o oficial
- **Instagram:** [@geocarautomoveis](https://www.instagram.com/geocarautomoveis/)
  — 468 seguidores. Bio: "Seu próximo carro está aqui! Compra • Venda •
  Troca • Financiamento". Destaques: Entregas, Avaliações, Aleatórios. Os
  posts (estoque) só aparecem logado no Instagram
- **Endereço:** Quadra 07 CL 20 loja 01 — Sobradinho/DF (mesma cidade da
  Ciapel)
- **Linktree:** https://linktr.ee/Geocarveiculos
  - WhatsApp George: 61 98115-3066
  - WhatsApp Diógenes: 61 98204-5568
  - Cadastro no Google Maps: https://share.google/4vJ08c0sYy2zwIXpZ (não deu
    pra abrir daqui — o Google pediu captcha; conferir no navegador)
- **Logo:** escrita "GEOCAR" em vermelho/azul/prata (foto de perfil do
  Instagram). Falta o arquivo em alta

## Escopo do sistema

### Vitrine (público)
- Lista de carros com filtros: marca, ano, faixa de preço, câmbio,
  combustível
- Página do carro: galeria de fotos, descrição, ficha técnica (marca,
  modelo, versão, ano fab./modelo, km, câmbio, combustível, cor,
  opcionais), preço e botão "Tenho interesse" no WhatsApp com mensagem
  pronta citando o carro
- Seções: financiamento/troca, avaliações, endereço com mapa

### Painel admin
- Cadastrar/editar/apagar carros: várias fotos com capa, descrição, ficha
  técnica, status (disponível / reservado / vendido) e destaque na home

### CRM — funil de negociação
- Kanban: Novo contato → Em negociação → Test drive / visita → Vendido /
  Perdido
- Card: nome, telefone, carro de interesse, origem (Instagram, WhatsApp,
  loja, indicação) e observação curta
- O admin cadastra o card na mão e arrasta entre as colunas

### Stack
Next.js + Tailwind + Supabase (banco, login do admin, fotos no Storage) +
Vercel (time `glsmteste`). Infra na conta do Gustavo enquanto for
prospecção — mesmo esquema da Plavii e da Bibi.

## O que reaproveitar da Bibi

De `clientes/Bibi-Perfumes-Importados/site/`:
- `src/components/admin/ProductForm.tsx` e `ProductsPanel.tsx` — base do
  cadastro de carros com upload de fotos
- `src/components/admin/OrdersKanban.tsx` e `src/lib/order-status.ts` —
  base do funil do CRM
- `src/lib/whatsapp.ts`, `src/lib/admin.ts`,
  `src/components/ProductGallery.tsx` e `supabase/schema.sql` (bucket de
  fotos + RLS)

## Fora do escopo por enquanto (ideias pra depois)

- Lead automático vindo do site (clique em "Tenho interesse" vira card)
- Histórico de contatos e lembrete de retorno por cliente
- Registrar a venda ligando cliente e carro (e tirar o carro da vitrine
  sozinho)

## Perguntas em aberto

- [ ] Qual WhatsApp vai no botão — George, Diógenes ou os dois? (no site
      estão os dois por enquanto)
- [ ] Os dois vão ser admin?
- [ ] Nome oficial: "Automóveis" ou "Veículos"?
- [x] Estoque e fotos dos carros: levantados no Instagram em 2026-10-12, ver
      `estoque.md`. São 11 anúncios à venda, com 124 fotos em
      `site/public/carros/`, e falta confirmar com a loja o que já saiu
- [ ] Logo em alta
- [x] Preço da proposta: R$ 700, pagamento único (decidido em 2026-10-18,
      resposta pronta em `abordagem.md`)
- [ ] Conferir o cadastro no Google Maps (nota, avaliações, horário)

## Site (construído em 2026-10-12)

**No ar desde 2026-10-12, em modo demonstração:**
https://geocar-automoveis.vercel.app (projeto Vercel `geocar-automoveis`, time
`glsmteste`). O projeto **não tem GitHub conectado**, porque a Vercel o criou
com a pasta raiz do repositório e todo push quebraria o build. Pra
republicar, rode de dentro de `clientes/Geocar/site/`:
`npx vercel deploy --prod --scope glsmteste`. Pra ter deploy automático,
primeiro ajuste o Root Directory pra `clientes/Geocar/site` no painel da
Vercel e depois reconecte com `vercel git connect`.

Fica em `clientes/Geocar/site/`: um projeto Next.js 16, TypeScript,
Tailwind e Supabase, com a mesma base da Bibi e banco próprio. Pra rodar
local: `geocar-site` no `.claude/launch.json` (porta 3002). Tem `noindex`
enquanto a Geocar não fecha.

- **Vitrine (`/`):** hero com a frase da bio, estoque com busca e filtros
  (marca, câmbio, ano, carros/motos, ordenação; filtro de preço só aparece
  quando algum carro tiver preço), seção de troca/financiamento/venda e
  endereço com mapa do Google
- **Página do carro (`/carro/<slug>`):** galeria com setas, miniaturas,
  deslizar no celular e tela cheia; ficha técnica; itens; descrição;
  "Tenho interesse" pro George e pro Diógenes (mensagem pronta com o
  carro e o link); "Simular financiamento"; "Veja também"
- **WhatsApp:** botão fixo no canto abre a escolha entre os dois vendedores.
  Os botões de serviço e de "não achou" vão pro George
- **Sem preço = "Preço sob consulta"** (a loja não divulga no Instagram)
- **Painel (`/entrar` → `/admin`):** resumo, Estoque (cadastrar/editar,
  fotos com capa e ordem, a foto é reduzida pra 1600px antes de subir;
  na lista dá pra trocar a situação e o destaque direto) e Negociações
  (quadro com as 5 etapas, arrastar no computador e setas no celular,
  WhatsApp do cliente no cartão)
- **Modo demonstração:** sem as variáveis do Supabase, a vitrine usa o
  estoque inicial (`src/lib/estoque-inicial.ts`) e o painel fica travado.
  Dá pra publicar assim pra mostrar pra loja antes de ligar o banco
- **Marca:** cores tiradas da logo oficial (azul-marinho, azul `#1f4fc6`,
  vermelho `#e1262b`, prata), que o Gustavo mandou em 2026-10-12. No
  cabeçalho, por enquanto, a logo é só texto ("GEO" + "CAR" em vermelho),
  até o arquivo da imagem entrar no projeto
- **Admin:** `gldsm584@gmail.com` (em `src/lib/admin.ts` e em `is_admin()`
  no `supabase/schema.sql`). Quando fechar, trocar pelos emails da loja

### Pra ligar o Supabase (falta fazer)

1. Criar o projeto no Supabase. Atenção: no plano grátis o limite é de 2
   projetos ativos, e Plavii e Bibi já usam o Supabase. Pode ser preciso
   pausar um deles ou usar outra conta
2. Authentication → Users → Add user → `gldsm584@gmail.com`, com "Auto
   Confirm User" marcado
3. SQL Editor: rodar `site/supabase/schema.sql` e depois
   `site/supabase/seed.sql` (os 11 veículos)
4. Copiar URL e anon key (Project Settings → API) pra `site/.env.local`
   (modelo em `.env.example`) e pras variáveis do projeto na Vercel
5. Republicar (`npx vercel deploy --prod --scope glsmteste`) depois de pôr
   as variáveis no projeto `geocar-automoveis` da Vercel

O estoque inicial é a fonte do seed. Se mudar, gerar de novo com
`node supabase/gerar-seed.mjs > supabase/seed.sql` (de dentro de `site/`).
