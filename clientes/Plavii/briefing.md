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

## Mudança de rumo (2026-10-04): catálogo + WhatsApp

Decisão do Gustavo antes de levar pro dono: o site tava virando loja
completa demais (checkout, Mercado Pago, endereço salvo) sem nunca ter
confirmado com o dono se ele entrega fora da cidade, qual método de
pagamento usa etc. — risco de o cliente não fechar por parecer complexo
demais. Mudança: o site vira vitrine/pré-visualização; quem fecha a
venda (forma de pagamento, entrega ou retirada) é a atendente, por
WhatsApp, fora do site.

Removido: pagamento (Mercado Pago inteiro — lib, 3 rotas de API,
dependência no `package.json`), página `/checkout`, página de
confirmação `/pedido/[id]`, rota `api/orders/[id]` (cancelar/apagar
pedido pendente), e o botão "Entregar em" do cabeçalho (seletor de
endereço salvo — não era GPS real, só CEP com ViaCEP). O carrinho
continua existindo; "Finalizar no WhatsApp" (`src/app/carrinho/page.tsx`)
monta a lista de itens + total num link `wa.me` (`src/lib/whatsapp.ts`).
**Número de WhatsApp ainda é placeholder** (`5561999999999` em
`src/lib/whatsapp.ts`) — trocar pelo número real da loja antes de
mostrar pro dono.

Painel admin: só o Dashboard saiu do menu (`AdminSidebar.tsx`) — as
métricas de receita não fazem mais sentido sem checkout automático, mas
a página continua no código, acessível direto por `/admin`. Pedidos e
Clientes continuam no menu (atualizado em 2026-10-04): como não existe
mais pedido automático, o admin lança a venda na mão depois de fechar no
WhatsApp, pelo botão "+ Nova venda" em `/admin/pedidos`
(`NewOrderModal.tsx` → `createManualOrder` em `src/lib/orders.ts`) —
escolhe os produtos do catálogo, quantidade e status; nome/telefone do
cliente, sem conta nem endereço (`user_id` null). `/admin/clientes`
agora agrupa pedido por **telefone**, não mais por conta de usuário
(`order.user_id`), pra conta real e venda manual caírem na mesma lista
de cliente quando o telefone bate.

`site/supabase/019_manual_orders.sql` já foi rodada no Supabase (libera
`user_id`/endereço nulo em `orders` e a policy de insert pro admin) —
"Nova venda" testado de ponta a ponta, salva certinho.

`/admin/clientes` (2026-10-04) também lista quem só criou conta e ainda
não comprou — antes só aparecia cliente com pedido, e toda conta nova
cadastrada em `/cadastro` sumia da tela. Rota `/api/admin/customers`
(antigo `/api/admin/emails`, renomeada e expandida) usa
`supabaseAdmin.auth.admin.listUsers()` pra trazer todas as contas
(nome/telefone/endereço do `user_metadata`), e `admin/clientes/page.tsx`
junta isso com os pedidos — conta sem pedido aparece como "Sem pedido,
cadastrou em [data]".

Corrigido em 2026-10-04 (2ª rodada): a 1ª versão agrupava por **telefone**,
e duas contas DIFERENTES com o mesmo telefone (ex: conta de teste reusando
o telefone da conta real) caíam na mesma linha, apagando uma da tela —
foi exatamente o que aconteceu testando (`test@gmail.com` sumiu, fundida
sem avisar na linha de `gldsm584@gmail.com`, mesmo telefone). Virou:
`buildCustomers` em `admin/clientes/page.tsx` agora pelo **id da conta**
primeiro — toda conta cadastrada sempre vira sua própria linha, nunca se
mistura com outra. Telefone só entra pra ligar pedido manual (sem
`user_id`, vendido pelo WhatsApp) na conta certa quando o telefone bate;
sem conta correspondente, o pedido manual vira linha própria por telefone,
como antes.

Também corrigido: `fetchAccounts()` engolia qualquer erro em silêncio
(`if (!response.ok) return []`) — por isso a tela parecia "funcionar" mesmo
quando a busca de contas falhava. Agora lança erro e a tela mostra um aviso
vermelho explicando a causa mais provável. Causa real descoberta testando:
Supabase guarda **uma sessão só por navegador** (chave fixa no
`localStorage`, sincronizada entre abas) — como admin loga pela mesma tela
`/entrar` que qualquer cliente, criar/entrar numa conta de cliente no MESMO
navegador onde o admin tava logado substitui a sessão ali (log automático
na conta nova é padrão do Supabase). **Pra testar conta de cliente sem
perder o login de admin: usa aba anônima ou outro navegador.**

Login/cadastro/conta do cliente (`/entrar`, `/cadastro`, `/conta/*`)
continuam — decisão de manter por enquanto, mesmo sem checkout usando
isso. `/conta/compras` ("Compras") e o cartão de "última compra" em
`/conta` ficam permanentemente vazios (nada mais cria pedido), mas isso
é inofensivo — são blocos condicionais, não quebram.

Página de produto (`src/app/produto/[slug]/page.tsx`) redesenhada estilo
Mercado Livre, a pedido do Gustavo (referência: site da Thiago Imports):
foto isolada numa moldura própria (borda + fundo cinza claro, selo de
desconto no canto), e do lado categoria + título + descrição + preço +
comprar tudo junto numa coluna só — tirou a caixa separada "Sobre o
produto" que ficava embaixo.

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
- [x] Limpar dados de teste no `/admin`: Projetor HY300 com preço R$ 1,00
      (gera selo -100%) e categoria errada (Pets); revisar produtos que
      pareçam de teste (ex.: "blb"). Em 2026-10-04: preços corrigidos
      (projetor R$ 189,00; Power Bank com desconto de -46%) e "blb"
      removido; categoria "Pets" do projetor corrigida também
- ~~[ ] Testar o checkout logado ponta a ponta~~ — obsoleto, checkout
      removido em 2026-10-04 (ver "Mudança de rumo")
- [x] Publicar num link de teste na Vercel — https://plavii.vercel.app
      (deploy em 2026-09-26, com chaves de teste do Mercado Pago;
      atualizado em 2026-09-27 com cabeçalho mobile novo e
      cancelar/apagar pedido)
- [ ] Ajustar "Site URL" do Supabase (Authentication → URL Configuration)
      pra https://plavii.vercel.app, senão links de e-mail apontam pro
      localhost
- ~~[ ] Testar o checkout de teste no link da Vercel~~ — obsoleto, checkout
      removido em 2026-10-04 (ver "Mudança de rumo")
- [ ] Pegar o número de WhatsApp real da loja e trocar o placeholder em
      `src/lib/whatsapp.ts` (`WHATSAPP_NUMBER`)
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
- ~~Checkout em `/checkout`~~ — removido em 2026-10-04 (ver "Mudança de
  rumo"). Tabelas `orders`/`order_items` (`site/supabase/002_orders.sql`)
  continuam no banco, só não recebem mais pedido novo
- Painel admin em `/admin` (exige login + email na lista de admin em
  `src/lib/admin.ts`) — barra lateral escura (layout em `app/admin/layout.tsx`,
  esconde o cabeçalho/rodapé da loja via `StoreChrome`). Desde 2026-10-04
  só tem Produtos no menu (cadastra/edita/apaga produtos); Dashboard,
  Pedidos e Clientes saíram do menu mas o código continua (ver "Mudança
  de rumo"). Admin de teste hoje: `gustest@gmail.com` (lista em
  `src/lib/admin.ts`; policies recriadas por `site/supabase/005_admin_gustest.sql`)
  — trocar pro email real quando definir
- ⚠️ "Confirm email" está DESATIVADO no Supabase (Authentication → Providers
  → Email) só pra facilitar teste. Reativar (ou configurar SMTP próprio)
  antes de lançar o site pra clientes de verdade — senão qualquer email
  falso consegue criar conta
- ~~Pagamento via Mercado Pago (Checkout Pro)~~ — removido em 2026-10-04,
  junto com o checkout (ver "Mudança de rumo"). A dependência `mercadopago`
  saiu do `package.json`; `.env.local` ainda tem as chaves de teste
  comentadas/sobrando, sem efeito
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
  (`src/lib/addresses.ts`, estado em `address-context.tsx`). O botão
  "Entregar em" saiu do cabeçalho em 2026-10-04 (ver "Mudança de rumo");
  o seletor (`AddressPicker`) continua acessível pelo menu da conta
  ("Endereços") pra quem já tinha endereço salvo
- Produto: "Comprar agora" (adiciona e vai pro carrinho) e "Adicionar ao
  carrinho"; layout enxuto estilo Mercado Livre. Carrinho finaliza no
  WhatsApp, não mais em checkout próprio (ver "Mudança de rumo")
- Painel do cliente em `/conta`: Visão geral, Compras (`getMyOrders`),
  Histórico, Favoritos e Meus dados (nome, telefones, trocar senha). Menu do
  usuário no topo (`UserMenu`) com "Entrar em outra conta" e "Sair".
  Histórico e favoritos ficam no localStorage do navegador (não no banco)
- ~~Compras: o cliente cancela/apaga pedido pendente~~ — rota `api/orders/[id]`
  removida em 2026-10-04 junto com o checkout; a tela `/conta/compras`
  continua existindo mas fica sempre vazia (nada mais cria pedido)
- Cabeçalho some ao rolar pra baixo e volta ao rolar pra cima
- Layout do cabeçalho (`Header.tsx`): no celular, logo + conta + carrinho em
  cima, busca embaixo (flexbox com `order`, sem endereço desde 2026-10-04).
  No desktop, uma linha só. Carrinho é só ícone em todos os tamanhos;
  "Entrar" é botão azul com ícone de pessoa e texto branco
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
- Hero da home virou carrossel de imagens (bolinhas, arrasta com mouse ou
  dedo, desliza suave, loop infinito sem "voltar"), gerenciado em "Gerenciar Heroes":
  arrasta a imagem pra adicionar um slide; sem nenhum slide, cai no Hero
  padrão de sempre. Editor por slide "estilo Canva": a imagem já vem pronta
  de fora (sem texto do site sobreposto — só a imagem, tipo Rockstar Games),
  com um botão flutuante opcional (texto, cor da letra, cor do fundo — os
  dois com seletor de cor nativo) e destino configurável (vitrine, um
  produto, uma categoria ou link personalizado). Tabela `hero_slides`
  (`supabase/010` a `014_hero_button_style.sql`)
- Hero passa de slide sozinho a cada 10s (estilo Rockstar Games): a bolinha
  do slide ativo vira uma barrinha que enche até trocar; botão de play/pause
  do lado pausa/retoma sem perder o tempo já decorrido (progresso controlado
  via `requestAnimationFrame`, não CSS puro). Reaproveita a trava de clique
  rápido do carrossel — adicionado em 2026-10-03 em `Hero.tsx`
- Hero sem setas: navega arrastando o slide com mouse (computador) ou dedo
  (celular), via Pointer Events. Troca se arrastar mais de 15% da largura
  ou com deslize rápido; senão volta pro lugar. O autoplay pausa enquanto
  arrasta, clique parado num botão do Hero continua abrindo o link e
  arrastar sobre o botão não abre — publicado em 2026-10-03 (PR #2).
  ✅ Conferido num celular de verdade em 2026-10-03/04 (funciona)
- Hero no celular: a altura acompanha a proporção da imagem do slide ativo,
  limitada a 3:2 (`MAX_MOBILE_RATIO` em `Hero.tsx`). Imagem larga (banner)
  preenche a moldura e perde só uma faixa pequena das laterais; quadrada ou
  vertical aparece inteira. De `sm` pra cima segue a moldura 16:9 / 21:9. Os
  botões flutuantes usam % da moldura, então no celular ficam em % da
  imagem já ajustada — publicado em 2026-10-03 (PRs #6 e #7)
- Carrinho: cada item tem um botão de lixeira visível à direita pro
  cliente remover o produto (antes era só um link "Remover" pequeno embaixo
  do nome) — publicado em 2026-10-03 (PR #1, `carrinho/page.tsx`);
  conferido num celular de verdade
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
- 🐛 Corrigido em 2026-10-03: clicar/tocar rápido demais nas setas do Hero
  (hoje removidas, o carrossel navega por arraste e mantém a mesma trava)
  travava o carrossel numa tela em branco. Causa: o loop infinito clona o
  primeiro/último slide nas pontas e só teleporta de volta pro slide real
  quando a transição de 700ms termina (`onTransitionEnd`); clique novo
  antes disso empurrava a posição além do clone, pra um índice que não
  existe. Resolvido travando novo clique/toque enquanto a transição ainda
  roda (`src/components/Hero.tsx`)

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
- [x] Produto de teste no catálogo (ex: "blb", Power Bank a R$ 1,00) —
      removido em 2026-10-03
- [x] Pedidos de teste criados durante os testes de hoje, misturados no
      banco de pedidos real — removidos em 2026-10-03

## Decisão comercial (2026-09-30)

Modelo escolhido: venda única (não mensalidade) — R$ 4.000 no Pix ou 3x de
R$ 1.500 no cartão (R$ 4.500), sem desconto adicional (atualizado em
2026-10-03; antes era R$ 5.000 aceitando até R$ 4.000). Parcelado só no
cartão, e as contas só passam pro dono depois do pagamento completo. Depois da venda, todas as
contas (Vercel, Supabase, Mercado Pago, domínio) passam pro nome/email
do próprio dono, que paga as assinaturas dele — Gustavo não fica preso
operando a infraestrutura do cliente. Qualquer alteração futura vira
serviço cobrado à parte.

Custo mensal estimado das ferramentas (plano pago, fica por conta do
dono depois da transferência): ~US$45/mês (Vercel Pro + Supabase Pro)
+ domínio .com.br (~R$40/ano) + taxa variável do Mercado Pago por venda
(sem mensalidade).
