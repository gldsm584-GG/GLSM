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

- Cor de destaque: azul (`#175291`); acento amarelo `#FFC83D` nas ofertas
- Fonte: Inter; ícones de traço simples (sem emojis) — ver `site/src/components/LineIcon.tsx`
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
- [x] Categorias (painel "Tudo" + barra), busca, cadastro completo,
      endereços múltiplos, "Comprar agora" e painel do cliente (`/conta`)
- [ ] Limpar dados de teste no `/admin`: Projetor HY300 com preço R$ 1,00
      (gera selo -100%) e categoria errada (Pets); revisar produtos que
      pareçam de teste (ex.: "blb")
- [ ] Testar o checkout logado ponta a ponta (cartão de endereço em tela)
- [x] Publicar num link de teste na Vercel — https://plavii.vercel.app
      (deploy em 2026-09-26, com chaves de teste do Mercado Pago;
      atualizado em 2026-09-27 com cabeçalho mobile novo e
      cancelar/apagar pedido)
- [ ] Ajustar "Site URL" do Supabase (Authentication → URL Configuration)
      pra https://plavii.vercel.app, senão links de e-mail apontam pro
      localhost
- [ ] Testar o checkout de teste no link da Vercel (retorno automático +
      webhook, que em localhost não funcionavam)
- [ ] Preparar abordagem pro dono — rascunho em `abordagem.md`, falta
      atualizar pra referenciar o site funcional (não mais screenshots)
- [ ] Publicar no plavii.vercel.app as novidades de 2026-09-27 (produto
      editável na loja, páginas em branco, opiniões de produto, Hero em
      carrossel, detalhes de cliente no admin) — rodar as migrações SQL
      novas (006 a 014) antes de publicar

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
- Categorias: lista fixa de 20 em `src/lib/categories.ts` (nome, slug, ícone,
  cor). O admin escolhe a categoria dessa lista; `/categoria/<slug>` filtra
  por ela. Navegação: botão "Tudo" (painel lateral, `CategoryDrawer`) + barra
  de atalhos no cabeçalho
- Busca: barra no topo com sugestões (`SearchBar`) e página `/busca?q=`; busca
  em nome, categoria e descrição, sem ligar pra acento (`src/lib/search.ts`)
- Cadastro completo (`AuthForm`): nome, sobrenome, celular, 2º número,
  endereço com CEP (ViaCEP) e senha com olhinho. Dados extras ficam no
  `user_metadata` do Supabase Auth (sem tabela nova)
- Endereços: lista por conta em `user_metadata.enderecos`
  (`src/lib/addresses.ts`, estado em `address-context.tsx`). Botão de
  localização no topo abre o seletor (`AddressPicker`: escolher, editar,
  adicionar, remover); o checkout usa o endereço escolhido. Pedido grava o
  endereço como texto (formato antigo, sem mudar `orders`)
- Produto: "Comprar agora" (adiciona e vai pro checkout) e "Adicionar ao
  carrinho"; layout enxuto estilo Mercado Livre
- Painel do cliente em `/conta`: Visão geral, Compras (`getMyOrders`),
  Histórico, Favoritos e Meus dados (nome, telefones, trocar senha). Menu do
  usuário no topo (`UserMenu`) com "Entrar em outra conta" e "Sair".
  Histórico e favoritos ficam no localStorage do navegador (não no banco)
- Compras: o cliente cancela pedido pendente e apaga pedido pendente/cancelado
  (`api/orders/[id]`, PATCH/DELETE). Apagar é bloqueado se o Mercado Pago já
  aprovou pagamento
- Cabeçalho some ao rolar pra baixo e volta ao rolar pra cima
- Layout do cabeçalho (`Header.tsx`): no celular 2 linhas — logo + endereço +
  carrinho em cima; busca + conta embaixo. No desktop, uma linha só. Carrinho
  é só ícone em todos os tamanhos; "Entrar" é botão azul com ícone de pessoa
  e texto branco
- Cor de marca: azul `#175291`, acento `#FFC83D`, fonte Inter
- Rodar localmente: `npm run dev` dentro de `site/` (porta 3000)
- Hospedagem de teste: Vercel, projeto `glsmteste/plavii` (conta Glsmteste,
  plano Hobby — só pra teste/demonstração; uso comercial exige Pro). URL:
  https://plavii.vercel.app. Republicar: `npx vercel --prod` dentro de
  `site/` (pasta já vinculada via `.vercel/`, ignorada pelo Git). As 5
  variáveis do `.env.local` estão cadastradas no painel da Vercel só com as
  chaves de TESTE do Mercado Pago — o token de produção não foi enviado;
  trocar só no lançamento, junto com o domínio definitivo. Alternativa pra
  produção: Hostinger com Node.js (o app não depende de disco local, tudo
  fica no Supabase). O deploy sai direto da pasta local
  (`npx vercel --prod --yes`); o projeto da Vercel não está ligado ao Git
- Edição direto na loja (sem entrar no painel `/admin`), só pro admin logado:
  botão flutuante "Editar produto" em cada página de produto (mesmo
  formulário do painel); botão "Gerenciar Heroes" na home
- Páginas em branco: 2 páginas (`/pagina/pagina-1`, `/pagina/pagina-2`) que o
  admin preenche com título + texto formatado (negrito/itálico) + imagem,
  direto pela própria página (botão "Editar página"). Aparecem sozinhas no
  rodapé, com o título como nome do link. Tabela `site_pages`
  (`supabase/008_site_content.sql`), bucket `site`
  (`supabase/009_site_storage.sql`)
- Opiniões de produto: nota média, estrelas, distribuição por nota, fotos
  dos clientes e lista de avaliações em cada página de produto; cliente
  logado avalia (1 avaliação por pessoa por produto, pode editar depois).
  Tabela `reviews` (`supabase/006_reviews.sql`), bucket `avaliacoes`
  (`supabase/007_reviews_storage.sql`)
- Hero da home virou carrossel de imagens (setinha + bolinhas, desliza
  suave, loop infinito sem "voltar"), gerenciado em "Gerenciar Heroes":
  arrasta a imagem pra adicionar um slide; sem nenhum slide, cai no Hero
  padrão de sempre. Editor por slide "estilo Canva": a imagem já vem pronta
  de fora (sem texto do site sobreposto — só a imagem, tipo Rockstar Games),
  com um botão flutuante opcional (texto, cor da letra, cor do fundo — os
  dois com seletor de cor nativo) e destino configurável (vitrine, um
  produto, uma categoria ou link personalizado). Tabela `hero_slides`
  (`supabase/010` a `014_hero_button_style.sql`)
- Painel Clientes do admin: cada cliente tem "Ver detalhes", que expande os
  pedidos dele com status e produtos comprados; a coluna de localização
  mostra endereço completo (rua/bairro, cidade, CEP), não só a cidade
- ✅ Publicado em produção em plavii.vercel.app (deploy automático via
  GitHub → Vercel, reconectado em 2026-09-29 depois de ter caído). Os 5
  itens acima e mais o que vem depois nessa lista já estão no ar
- 🐛 Corrigido em 2026-10-02: home, categoria, produto e página (`/pagina/<slug>`)
  eram geradas como estáticas no build do Next.js e só atualizavam no
  próximo deploy — edição feita no admin direto no site em produção
  (ofertas, categoria, preço, texto de página) salvava no Supabase
  certinho, mas não aparecia pro visitante até novo deploy. Em localhost
  não dava pra perceber porque o modo dev sempre busca dado fresco.
  Resolvido com `export const dynamic = "force-dynamic"` nas 4 páginas,
  forçando busca nova no Supabase a cada visita

## Checklist antes de lançar de verdade (levantado em 2026-09-30)

O que pode dar problema se esse site for pro ar valendo com cliente de
verdade, por gravidade:

**Grave**
- [x] Token do Mercado Pago em uso — confirmado com o Gustavo que é de
      teste, não de produção (2026-09-30)
- [x] Sem política de privacidade/termos — criada em
      `/politica-de-privacidade`, cobrindo os pontos da LGPD (falta só
      preencher razão social/CNPJ e o email de contato quando fechar
      com o dono)
- [ ] Plavii ainda não é cliente fechado — CNPJ tirado do rodapé por
      enquanto; falta formalizar o acordo por escrito antes de tráfego
      real

**Importante**
- [ ] Conta do Supabase é do Gustavo, não da Plavii — resolve na hora de
      fechar com o Supabase "Transfer project" (não precisa recriar o
      SQL do zero)
- [ ] Hospedagem no plano Hobby da Vercel não é pra uso comercial —
      precisa virar Pro (~US$20/mês) antes do lançamento de verdade
- [ ] Confirmação de email desligada no Supabase — precisa configurar
      SMTP (Resend, plano grátis já serve) antes de religar
- [ ] Projeto Supabase free pausa sozinho por inatividade — resolve
      junto com a migração pro plano pago
- [ ] Nenhum monitoramento de erro/uptime — ninguém é avisado se o site
      cair em produção

**Pra limpar antes de mostrar pro dono**
- [ ] Produto de teste no catálogo (ex: "blb", Power Bank a R$ 1,00)
- [ ] Pedidos de teste criados durante os testes de hoje, misturados no
      banco de pedidos real

## Decisão comercial (2026-09-30)

Modelo escolhido: venda única (não mensalidade) — pedir R$ 5.000, aceita
negociar até R$ 4.000 se o dono pedir desconto. Depois da venda, todas as
contas (Vercel, Supabase, Mercado Pago, domínio) passam pro nome/email
do próprio dono, que paga as assinaturas dele — Gustavo não fica preso
operando a infraestrutura do cliente. Qualquer alteração futura vira
serviço cobrado à parte.

Custo mensal estimado das ferramentas (plano pago, fica por conta do
dono depois da transferência): ~US$45/mês (Vercel Pro + Supabase Pro)
+ domínio .com.br (~R$40/ano) + taxa variável do Mercado Pago por venda
(sem mensalidade).
