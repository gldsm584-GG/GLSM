# Plavii

> Cliente em prospecção. Criado em 2026-09-18.

## Sobre

Loja multicategoria (Brasília/DF), com site próprio (WordPress +
WooCommerce) e Instagram ativo (@plavii.br, ~9k seguidores).

**Site:** https://plavii.com/
**Instagram:** https://www.instagram.com/plavii.br

## Categorias de produto

- Eletrônicos (carregadores, cabos, power bank, smartwatch, pulseiras)
- Acessórios de celular (capinhas e películas — iPhone, Xiaomi,
  Samsung, Motorola, Realme)
- Brinquedos (bebês, crianças, adultos)
- Utilidades domésticas (cozinha, copos térmicos, garrafas)
- Informática (mouse, teclado, adaptadores)
- Áudio (caixas de som, microfones, fones, Bluetooth)

## Diferenciais que o site atual já comunica

- Frete grátis a partir de R$14,99
- Entrega rápida
- Garantia de até 1 ano
- Estabelecimento físico (CNPJ e endereço, loja física legítima)
- Horário: Seg-Sex 9:30-19:00, Sáb 9:30-18:00, Dom fechado

## Tom da marca (Instagram)

Descontraído, emotivo, emojis abundantes, linguagem coloquial,
campanhas sazonais (Black Friday, Páscoa, Natal, Dia dos Namorados),
foco em promoção/urgência.

## Identidade visual

- Cor de destaque: azul
- Logo: `clientes/Plavii/logo.png`

## Status

Prospecção — ainda não é cliente fechado.

## Objetivo

Construir a loja funcional de verdade pra Plavii (Next.js), evoluindo em
etapas: vitrine estática → carrinho → banco de dados → login → checkout →
painel admin → pagamento real. O mockup estático inicial (HTML puro) foi
substituído por essa aplicação assim que o escopo virou "loja completa".

## Próximos passos

- [x] Levantar referências visuais/estruturais de e-commerce — dados reais
      do site (plavii.com), Instagram (@plavii.br) e Facebook
      (facebook.com/hometechdf, hoje sob o nome Plavii)
- [x] Vitrine estática — home com grid de produtos (dados mockados em JSON)
- [x] Página de produto individual
- [x] Carrinho (localStorage, sem backend ainda)
- [x] Banco de dados real (Supabase) no lugar do JSON mockado
- [x] Login / conta de usuário (Supabase Auth — email/senha)
- [x] Checkout (sem pagamento real ainda — simula pedido e salva no banco)
- [x] Painel admin pra cadastrar produtos e gerenciar pedidos
- [x] Pagamento (Mercado Pago Checkout Pro) — testado de ponta a ponta em
      modo teste em 2026-09-23: pagamento aprovado → pedido virou
      "confirmado" no banco. Falta só a produção (ver nota abaixo).
- [ ] Preparar abordagem pro dono — rascunho em `abordagem.md`, falta
      atualizar pra referenciar o site funcional (não mais screenshots)

## Site

Fica em `clientes/Plavii/site/` — projeto Next.js (TypeScript + Tailwind):
- Produtos vêm do Supabase (banco Postgres na nuvem), tabela `products`
  — schema e seed em `site/supabase/schema.sql`
- Conta Supabase: criada com o email do Gustavo (não da Plavii), projeto
  `plavii`, plano Free — transferir posse pra conta do cliente quando o
  negócio fechar
- Chaves de conexão em `site/.env.local` (não versionado no Git)
- Login de cliente via Supabase Auth (email/senha), em `src/lib/auth-context.tsx`
  — páginas `/entrar` e `/cadastro`
- Checkout em `/checkout` (exige login) → salva pedido nas tabelas `orders` +
  `order_items` (schema em `site/supabase/002_orders.sql`) → confirmação em
  `/pedido/[id]`. Cada pessoa só vê os próprios pedidos (RLS)
- Painel admin em `/admin` (exige login + email na lista de admin em
  `src/lib/admin.ts`) — barra lateral escura (layout em `app/admin/layout.tsx`,
  esconde o cabeçalho/rodapé da loja via `StoreChrome`) com Dashboard
  (receita, pedidos, produtos, clientes), Pedidos, Produtos e Clientes
  (derivado dos pedidos); cadastra/edita/apaga produtos, vê e muda status de
  TODOS os pedidos. Permissões de escrita liberadas via RLS só pro email
  admin (`site/supabase/003_admin.sql`). Admin de teste hoje:
  `gustest@gmail.com` (lista em `src/lib/admin.ts`; policies recriadas por
  `site/supabase/005_admin_gustest.sql`) — trocar pro email real quando definir
- ⚠️ "Confirm email" está DESATIVADO no Supabase (Authentication → Providers
  → Email) só pra facilitar teste. Reativar (ou configurar SMTP próprio)
  antes de lançar o site pra clientes de verdade — senão qualquer email
  falso consegue criar conta
- Pagamento via Mercado Pago (Checkout Pro): `/api/checkout` cria a
  cobrança e redireciona; `/api/mercadopago/verify` confirma quando o
  cliente volta (funciona em localhost, sem precisar de URL pública);
  `/api/mercadopago/webhook` é a versão "de produção" (precisa de domínio
  público pra o Mercado Pago conseguir chamar). Credenciais de teste em
  `.env.local` (`MERCADOPAGO_ACCESS_TOKEN`); o token de produção fica
  comentado no mesmo arquivo pra trocar quando for lançar
  - Lição: o botão "Pagar" ficava cinza porque vendedor e comprador eram
    a MESMA conta (o token de teste e o usuário de teste tinham o mesmo
    id 3707201207). O Mercado Pago bloqueia isso sem mostrar erro. Pra
    testar, o comprador tem que ser OUTRA conta de teste (Contas de
    teste → criar um 2º comprador). Em produção, quem paga não pode ser
    a conta dona do token
  - Em localhost o Mercado Pago não mostra botão "voltar ao site" nem
    chama o webhook; a volta é simulada abrindo
    `/pedido/<id>?payment_id=<id do pagamento>`, que dispara o verify
  - Pendente pro lançamento: domínio público (pra webhook e retorno
    automático) e trocar pro token de produção
- Fotos de produto: as 5 originais ficam em `site/public/produtos/`; as novas
  são enviadas pelo painel admin pro Supabase Storage (bucket público
  `produtos`, só admin envia — `site/supabase/004_storage.sql`, precisa rodar
  no SQL Editor). Imagem inválida no banco vira `/sem-imagem.svg` em vez de
  quebrar a loja (`safeImageSrc` em `src/lib/products.ts`)
- Carrinho via `src/lib/cart-context.tsx` (Context API + localStorage,
  produtos buscados do Supabase)
- Cor de marca: azul `#175291`, fonte Inter (mesma linha visual do mockup)
- Rodar localmente: `npm run dev` dentro de `site/` (porta 3000)
