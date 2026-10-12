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

- [ ] Qual WhatsApp vai no botão — George, Diógenes ou os dois?
- [ ] Os dois vão ser admin?
- [ ] Nome oficial: "Automóveis" ou "Veículos"?
- [x] Estoque e fotos dos carros: levantados no Instagram em 2026-10-12, ver
      `estoque.md`. São 11 anúncios à venda, com 124 fotos em `fotos/`, e
      falta confirmar com a loja o que já saiu
- [ ] Logo em alta
- [ ] Preço da proposta
- [ ] Conferir o cadastro no Google Maps (nota, avaliações, horário)

## Site

Fica em `clientes/Geocar/site/` — ainda vazio. Construção na próxima
sessão, aberta dentro da pasta.
