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

- Entrega rápida
- Garantia de até 1 ano
- Estabelecimento físico (CNPJ e endereço, loja física legítima)
- Horário: Seg-Sex 9:30-19:00, Sáb 9:30-18:00, Dom fechado
- ~~Frete grátis a partir de R$14,99~~ — removido do site em 2026-10-04
  (carrinho, rodapé, Hero, SEO, Política de Privacidade); a loja não
  promete frete grátis por enquanto, dá pra recolocar depois

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

## Galeria de fotos do produto (2026-10-05)

A página do produto ganhou uma galeria com várias fotos e zoom ao passar o mouse
(`src/components/ProductGallery.tsx`). A coluna `image` continua sendo a capa
(cards, carrinho, busca, Hero); a nova coluna `images` (lista de fotos, com a
capa na posição 0) guarda a galeria. Migração `supabase/021_product_images.sql`
rodada no Supabase em 2026-10-05 (deu sucesso): criou a coluna e copiou a foto
atual de cada produto pra dentro da lista. Pra ter várias fotos, editar o
produto no admin e adicionar imagens.

## Entrega: retirada na loja + Melhor Envio (2026-10-05)

No checkout (`/checkout`), depois do endereço, o cliente escolhe o **método de
entrega**: **Retirada na loja** (grátis, vem marcada) ou um serviço cotado no
**Melhor Envio** pelo CEP (Correios PAC/SEDEX, Jadlog etc., com preço e prazo em
dias úteis, ordenados do mais barato). O frete entra no total e no
Mercado Pago como um item "Frete — <serviço>".

Como funciona (arquivos): `src/lib/shipping.ts` (cotação, só servidor),
`src/app/api/shipping/quote/route.ts` (cotação pro checkout, exige login) e
`src/app/api/checkout/route.ts` (cota **de novo no servidor** o serviço
escolhido — o valor nunca vem do navegador — e grava total + método no
pedido). Pedido e admin mostram "Retirada na loja" ou "serviço — valor —
prazo". Sem token ou sem CEP de origem, o site oferece só a retirada.

**Status (2026-10-05):** as variáveis `MELHORENVIO_TOKEN` (token de PRODUÇÃO,
gerado em Integrações → Permissões de acesso na conta real do Melhor Envio),
`MELHORENVIO_ORIGIN_CEP` e `MELHORENVIO_CONTACT_EMAIL` já foram cadastradas na
Vercel (só Production, como Secret — o valor não aparece mais no painel).
`MERCADOPAGO_ACCESS_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`
e `NEXT_PUBLIC_SUPABASE_ANON_KEY` já existiam. Redeploy feito, frete testado no
site real (funciona) e migração `020_shipping.sql` rodada no Supabase em
2026-10-05 (deu sucesso). Se o frete sumir do checkout algum dia, suspeitar do
token vencido (gerar outro e trocar na Vercel).

**FRETE FUNCIONANDO EM PRODUÇÃO (2026-10-05):** no checkout de plavii.vercel.app
aparecem a Retirada na loja (grátis) e 6 opções do Melhor Envio (Loggi Express,
Correios SEDEX, Jadlog .Package e .Com, Loggi Ponto e Coleta), com preço e prazo
em dias úteis. A primeira tentativa falhou porque o CEP de origem estava errado
(foi usado o CEP de exemplo `73000000`, que não existe); corrigido com o CEP real
da loja. Como diagnosticar se der problema: Vercel → Logs, buscar `frete`; o site
anota o motivo (`[frete] cotação falhou: ...`, com o campo que o Melhor Envio
rejeitou). Atenção: ao testar, usar `plavii.vercel.app`, não o endereço de um
deploy antigo (esse fica preso na versão antiga). A migração `020` já foi rodada
(2026-10-05), então os pedidos novos guardam o método de entrega. Ainda falta:
peso/medidas por produto (ideia salva, a conversar com o cliente), comprar a
etiqueta (manual, no painel do Melhor Envio, que exige créditos na carteira) e
decidir quais transportadoras mostrar (hoje aparecem todas as que o Melhor Envio
devolve).

**WhatsApp no checkout (2026-10-05):** a página `/checkout` agora também tem o
botão "Finalizar no WhatsApp" (antes só existia no carrinho). A mensagem leva
itens, nome, entrega escolhida (retirada ou transportadora + valor) e o total
já com o frete. No carrinho a mensagem segue sem entrega.

**O que o Gustavo precisa fazer pra ligar o frete**
1. Criar conta no Melhor Envio (comece pelo sandbox, `sandbox.melhorenvio.com.br`,
   que é separado da conta real e só simula Correios e Jadlog).
2. Gerar um token de acesso no painel e guardar na Vercel (Settings →
   Environment Variables), nunca no código:
   `MELHORENVIO_TOKEN`, `MELHORENVIO_ORIGIN_CEP` (CEP da loja),
   `MELHORENVIO_CONTACT_EMAIL` (email de contato técnico, vai no User-Agent) e,
   pra testar no sandbox, `MELHORENVIO_API_URL=https://sandbox.melhorenvio.com.br`.
   Depois de salvar as variáveis, fazer um novo deploy.
3. Rodar `site/supabase/020_shipping.sql` no SQL Editor do Supabase (colunas de
   entrega no pedido) — FEITO em 2026-10-05. Sem ela o checkout funciona, só não
   registra o método.
4. Quando for pra valer, trocar pro token de produção e tirar `MELHORENVIO_API_URL`.

**IDEIA SALVA PRA DEPOIS (2026-10-05, a conversar com o cliente):** campos de
peso e medidas no cadastro de produto, pra o frete sair certo, e compra
automática da etiqueta — ver `_memoria/estrategia.md`, "Ideias guardadas pra
depois". Não fazer antes de falar com o cliente.

**Limites conhecidos:** os produtos ainda não têm peso/medidas; a cotação usa uma
caixa padrão por item (0,5 kg, 20x15x20 cm; ajustável por
`SHIPPING_DEFAULT_*`). Próximo passo natural: campos de peso/medidas no cadastro
de produto. Também falta comprar a etiqueta do envio (hoje manual, no painel do
Melhor Envio). Prazos médios (blogs, 2026-10): SEDEX 1 a 3 dias úteis; PAC até 10
(3 a 10); Jadlog Package 5 a 7; o prazo real vem da API por CEP.

Testado (build de produção, Supabase e Melhor Envio simulados, celular): opções
com preço e prazo, serviço com erro descartado, total muda ao escolher, servidor
recota e grava `total` + dados do frete; sem configuração aparece só a retirada;
sem login a cotação responde 401. **Não testado:** Melhor Envio real e o
pagamento do Mercado Pago de verdade (rede bloqueada aqui).

## Volta do pagamento (2026-10-05): os dois jeitos

A pedido do Gustavo, o pagamento pelo Mercado Pago voltou, ao lado do
WhatsApp. Restaurado do commit `24ad9d9` (o anterior à mudança de rumo):
`/checkout`, `/pedido/[id]`, rotas `api/checkout`, `api/mercadopago/verify`,
`api/mercadopago/webhook`, `api/orders/[id]`, `src/lib/mercadopago.ts`,
`payment-status.ts`, dependência `mercadopago`, o seletor "Entregar em" do
cabeçalho (`Header.tsx`), `createOrder`/`getOrder`/`cancelOrder`/
`deleteOrder` em `orders.ts`, as páginas `/conta` e `/conta/compras` (com
cancelar/apagar pedido) e o Dashboard no menu do admin. "Comprar agora"
volta pro checkout. Mantido da fase WhatsApp: botão "Finalizar no WhatsApp"
(agora o segundo botão do carrinho), "+ Nova venda", kanban de pedidos,
clientes agrupados por telefone e a migração `019`. Fica fora o "frete
grátis", removido de propósito em 2026-10-04.

Testado (build de produção, Supabase simulado, celular): carrinho com os
dois botões; "Finalizar compra" pede login e, logado, abre "Finalizar
pedido". **Não testado:** o pagamento de verdade (token, webhook e
Supabase reais). Requisitos: `MERCADOPAGO_ACCESS_TOKEN` e
`SUPABASE_SERVICE_ROLE_KEY` nas variáveis da Vercel; token de produção
antes de vender de verdade. O texto abaixo (fase só-WhatsApp) vale como
histórico; onde disser que o pagamento "foi removido", leia como "removido
em 2026-10-04 e restaurado em 2026-10-05".

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
**Número de WhatsApp é o da loja** (`5561992332876`, `61 99233-2876`, em
`src/lib/whatsapp.ts`; trocado em 2026-10-05, era o número de teste do
Gustavo). Cuidado ao testar o botão: a mensagem vai pra loja de verdade. Mensagem
(2026-10-04): "Olá! Meu nome é <nome>. Tenho interesse em comprar este
produto que vi no site:" + lista + total; o nome vem **só do cadastro**
(conta logada com nome — sem campo pra digitar) e, sem cadastro ou com
conta sem nome, a mensagem sai sem a parte do nome. Com mais de um item,
"estes produtos". Botão testado de ponta a ponta no celular.

Painel admin: só o Dashboard saiu do menu (`AdminSidebar.tsx`) — as
métricas de receita não fazem mais sentido sem checkout automático, mas
a página continua no código, acessível direto por `/admin`. Pedidos e
Clientes continuam no menu (atualizado em 2026-10-04): como não existe
mais pedido automático, o admin lança a venda na mão depois de fechar no
WhatsApp, pelo botão "+ Nova venda" em `/admin/pedidos`
(`NewOrderModal.tsx` → `createManualOrder` em `src/lib/orders.ts`) —
escolhe os produtos do catálogo, quantidade e status; nome/telefone do
cliente, sem conta nem endereço (`user_id` null). `/admin/clientes`
junta pedido manual (sem conta) na conta de telefone igual quando existe
— ver correção abaixo pra como isso funciona de verdade hoje.

`site/supabase/019_manual_orders.sql` já foi rodada no Supabase (libera
`user_id`/endereço nulo em `orders` e a policy de insert pro admin) —
"Nova venda" testado de ponta a ponta, salva certinho.

Ajustes visuais e de texto (2026-10-04): selo de desconto dos cards agora
verde (igual ao "% OFF" da página do produto); "frete grátis" removido do
carrinho, rodapé, Hero padrão, título/descrição do site (SEO) e da Política
de Privacidade — a loja não promete frete grátis por enquanto (a entrega é
combinada com a atendente pelo WhatsApp); dá pra recolocar depois.

Limpeza pós-mudança de rumo (2026-10-04, achada ao testar o build): as
páginas `/conta` e `/conta/compras` ainda apontavam pra `/pedido/<id>`
(rota removida → 404) e ofereciam "Cancelar/Apagar pedido" (chamavam a
rota `api/orders/[id]`, removida). Tirei esses links/botões e o código
morto em `src/lib/orders.ts`; a Política de Privacidade parou de citar o
Mercado Pago e passou a citar o WhatsApp. Teste feito: `next build` passa
e o fluxo celular (produto → carrinho → link `wa.me` com itens e total →
lixeira) roda sem erro de JavaScript. Não testado: login e painel admin
(precisam do Supabase de verdade).

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
- [x] Pegar o número de WhatsApp real da loja e trocar o número de teste
      em `src/lib/whatsapp.ts` (`WHATSAPP_NUMBER`) — feito em 2026-10-05
      (`61 99233-2876`)
- [x] Preparar abordagem pro dono — `abordagem.md` reescrita em 2026-10-03
      e atualizada em 2026-10-04 pro formato catálogo + WhatsApp
- [x] Publicar no plavii.vercel.app as novidades de 2026-09-27 (produto
      editável na loja, páginas em branco, opiniões de produto, Hero em
      carrossel, detalhes de cliente no admin) — rodar as migrações SQL
      novas (006 a 014) antes de publicar — já no ar

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
  esconde o cabeçalho/rodapé da loja via `StoreChrome`). Menu
  (`AdminSidebar.tsx`): Pedidos, Produtos, Clientes — só o Dashboard saiu
  (métricas de receita não fazem sentido sem checkout automático), mas a
  página continua no código, acessível direto por `/admin` (ver "Mudança
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
contas (Vercel, Supabase, domínio) passam pro nome/email
do próprio dono, que paga as assinaturas dele — Gustavo não fica preso
operando a infraestrutura do cliente. Qualquer alteração futura vira
serviço cobrado à parte.

Custo mensal estimado das ferramentas (plano pago, fica por conta do
dono depois da transferência): ~US$45/mês (Vercel Pro + Supabase Pro)
+ domínio .com.br (~R$40/ano). Sem taxa por venda, já que o site não
processa pagamento desde 2026-10-04 (sem mensalidade).
