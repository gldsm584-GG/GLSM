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

- Paleta vinho/champagne/dourado (redesenhada em 2026-10-08 pra ficar mais
  premium; antes era rosa/magenta inspirada no print de catálogo): fundo
  creme `#faf5ee`, texto `#2a1520`, vinho `--brand #7b2646`, vinho escuro
  `--brand-dark #3a0f24`, blush `--brand-light #e6c3bd`, dourado
  `--accent #c0975a` (`src/app/globals.css`). Os cinzas do Tailwind
  (`neutral-*`) foram trocados por tons quentes de pedra/champagne no mesmo
  arquivo. Hero da home escuro (degradê vinho com brilho dourado)
- Tipografia: Cormorant Garamond (serifada) em títulos h1/h2, nome no
  cabeçalho e rodapé; Inter no resto. Antes era Playfair Display
- Logo: recebido em 2026-10-07 — selo redondo dourado-rosé em fundo de
  mármore rosa (frasco + coroa + "BIBI Perfumes Importados"). Original em
  `clientes/Bibi-Perfumes-Importados/logo.jpeg` (1254x1254) — nunca em
  `identidade/` (reservada pra marca pessoal do Gustavo). No site: recorte
  redondo em `site/public/logo.png` (cabeçalho e rodapé), ícone da aba
  `site/src/app/icon.png` e `apple-icon.png` (atalho no celular)
- Obs.: o logo é rosé/blush; a paleta nova (vinho + champagne) já combina
  melhor com ele que o magenta antigo

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

- ~~Sem login de cliente~~ — MUDOU em 2026-10-07 (pedido do Gustavo):
  agora tem conta de cliente OPCIONAL. Botão "Entrar" no cabeçalho →
  `/entrar` e `/cadastro` (nome, sobrenome, CEP com busca automática no
  ViaCEP, rua, número, complemento, bairro, cidade, UF, email e senha) e
  área `/conta` com menu lateral (Visão geral, Histórico, Favoritos, Meus
  dados em `/conta/dados`). Logado, o cabeçalho mostra um menu igual ao da
  Plavii (Minha conta, Histórico, Favoritos, Endereço, Meus dados, Painel do
  administrador só pro admin, Entrar em outra conta, Sair). Sem "Compras":
  as vendas fecham no WhatsApp e não ficam ligadas à conta do cliente.
  Favoritos (coração nos cards e na página do produto) e histórico ficam
  salvos só no navegador, como na Plavii. Os dados ficam na própria
  conta do Supabase (`user_metadata`), sem tabela nova nem SQL. Logado, o
  carrinho já manda nome e endereço do cadastro na mensagem do WhatsApp.
  Comprar sem conta continua funcionando igual
- ⚠️ Supabase (Authentication → Sign In / Providers → Email): conferir
  "Allow new users to sign up" LIGADO e decidir o "Confirm email". Ligado
  sem SMTP próprio, o email de confirmação só chega pra emails da equipe
  do Supabase — cliente de verdade não consegue entrar. Opções: desligar
  (como na Plavii) ou configurar SMTP próprio. Resend precisa de domínio
  próprio; SEM domínio, o caminho é o Gmail da loja (decidido em 2026-10-07,
  o Gustavo vai fazer depois):
  1. Conta Google `bibiperfumes@gmail.com` → Segurança → ativar
     Verificação em duas etapas
  2. Criar senha de app em https://myaccount.google.com/apppasswords
     ("Supabase") — código de 16 letras, NÃO a senha normal
  3. Supabase → Authentication → Emails → SMTP Settings → Enable Custom
     SMTP: sender `bibiperfumes@gmail.com`, nome `Bibi Perfumes`, host
     `smtp.gmail.com`, porta `465`, usuário `bibiperfumes@gmail.com`,
     senha = código do passo 2 (limite ~500 emails/dia)
  4. Authentication → URL Configuration → Site URL =
     https://bibi-perfumes-glsmteste.vercel.app
  5. Ligar "Confirm email" e testar com um email que NÃO seja da equipe do
     Supabase (o do Gustavo sempre recebe, não prova nada)
  Depois: traduzir o template do email de confirmação (hoje em inglês) e
  fazer "Esqueci minha senha" no site (também depende do SMTP)
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
- TROCADO em 2026-10-07 (pedido do Gustavo): admin passa a ser
  `bibiperfumes@gmail.com`. Código em `src/lib/admin.ts` e banco via
  `site/supabase/002_admin_bibiperfumes.sql` (as 9 políticas agora usam a
  função `is_admin()` — pra trocar de novo, muda só ela). Ordem: 1) criar a
  conta no Supabase (Add user, Auto Confirm), 2) rodar o SQL, 3) publicar.
  A conta `gldsm584@gmail.com` vira conta comum (pode apagar se quiser)

## Pendências antes de divulgar

- [x] Criar o projeto Supabase novo e rodar `site/supabase/schema.sql`
      — feito em 2026-10-06 (projeto `pmacqaerzglwcljxifxo`)
- [x] Criar o projeto Vercel novo e publicar — feito em 2026-10-06
      (Root Directory corrigido pra `clientes/Bibi-Perfumes-Importados/site`,
      proteção SSO desligada pra ficar público)
- [x] Número de WhatsApp real da loja — `61 9917-3630`, atualizado em
      2026-10-06 em `src/lib/whatsapp.ts`
- [ ] Fotos reais dos 12 perfumes (hoje todos usam `/sem-imagem.svg` —
      sobe pelo admin em Produtos). Yum Yum: foto em alta feita no Gemini
      a partir da foto real, em `fotos/yum-yum/frasco-gemini.png` (ainda
      não subida no admin)
- [x] Logo real da Bibi Perfumes — recebido e aplicado em 2026-10-07
- [ ] Conferir "Confirm email" no Supabase e testar um cadastro de
      verdade (ver "Decisões de escopo")
- [x] Trocar admin pra `bibiperfumes@gmail.com` — conta criada, SQL
      `002_admin_bibiperfumes.sql` rodado e publicado; Gustavo confirmou
      que funcionou em 2026-10-07

## Ideias de evolução do visual (sugeridas em 2026-10-08)

Feito: paleta e tipografia (acima). Ainda não feito, em ordem de impacto:
- [ ] Fotos reais dos frascos (maior ganho de todos)
- [ ] Hero da home com o frasco girando no scroll (a demo do Yum Yum)
- [ ] Pirâmide olfativa interativa (topo/coração/fundo se acendem)
- [ ] Microinterações (tilt nos cards, revelação no scroll, transições)
- [ ] Filtro por família olfativa e mini quiz "qual perfume é você?"
- [ ] Selo "100% original", avaliações, Instagram embutido

## Demo de animação no scroll — Yum Yum (2026-10-07)

Página de demonstração separada do site, em `demo-scroll/index.html`:
doces "explodem" pra fora da tela, o frasco gira em 3D conforme rola
(120 quadros tirados de um vídeo do Kling), notas de topo/coração/fundo
aparecem uma por vez, final com preço e botão pra página do produto.
Fotos e vídeo originais em `fotos/yum-yum/` (Gemini + Kling, plano grátis).
Ainda NÃO está no site real. Antes de levar:
- [ ] Refazer a imagem dos doces no Gemini sem a marca "OREO" nos biscoitos
- [ ] Deixar leve: hoje ~5,6 MB; com 60 quadros (PC) / 40 (celular) e
      doces em webp cai pra ~1–2 MB

## Site

Fica em `clientes/Bibi-Perfumes-Importados/site/` — projeto Next.js
independente (TypeScript + Tailwind + Supabase), reaproveitando os
padrões já validados no site da Plavii (`clientes/Plavii/site/`), mas
com banco e deploy próprios — não compartilha nada com a Plavii.
