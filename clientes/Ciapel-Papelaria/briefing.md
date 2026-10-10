# Ciapel Papelaria — briefing

**Status:** prospecção (iniciada em 2026-10-08). Landing page de demonstração
pronta em `mockup/`, ainda não enviada ao dono.

## Quem é

- Papelaria em Sobradinho – DF, **desde 2000** (26 anos)
- Vende: papelaria/material escolar, presentes, informática, copiadora
  (cópias, impressões, plastificação) e personalizados (gravação a laser em
  copos térmicos, canecas, squeezes, canecas de chopp; carimbos profissionais)
- Faz **entregas** e recebe pedidos pelo WhatsApp
- Marca: azul royal + vermelho + branco, mascote (menino de boné "Ciapel"
  segurando um globo). Arte do Instagram é feita no mesmo padrão (estilo
  ilustração 3D/cartoon)

## Lojas

| Loja | Endereço | Google |
|---|---|---|
| Sobradinho I (principal) | Quadra 08, Bloco 18, Lote 04, Loja 01 – Sobradinho, Brasília – DF, CEP 73005-518 | 4,3 ★ · 798 avaliações · site aponta pro Facebook · tem "Entrega" e "Retirada na loja" |
| Sobradinho II | AR 9, Conj. 1A, Lote 2 – Sobradinho II, Brasília – DF, CEP 73060-700 | 4,0 ★ · 35 avaliações · **ficha não reivindicada**, sem telefone e sem site · Google diz que abre 8h00 |

## Contato

- WhatsApp (pedidos, Sobradinho I): **(61) 99626-5726**
- Fixos: (61) 3387-7784 (Sobradinho I) · (61) 3591-9231 (Sobradinho II). O WhatsApp (61) 99626-5726 e o fixo 3387-7784 são de Sobradinho I (confirmado pelo Gustavo em 2026-10-09). Na página, cada loja mostra o fixo e o WhatsApp no próprio quadro, e a linha "Telefones" separa "Sobradinho I" e "Sobradinho II"
- **Sobradinho II tem contato próprio** (placas da fachada, fotos do Gustavo, 2026-10-09): endereço "AR 09 - 09 - CONJ. 1A - LT. 02 - SOB. II - DF", fixo **(61) 3591-9231**, WhatsApp **(61) 99634-8804**, e-mail **ciapelpapelariasob2@gmail.com** e o mesmo Instagram. Esses dados servem pra preencher o cadastro de Sobradinho II no Google Maps (hoje sem telefone). Na página, o fixo e o WhatsApp de Sobradinho II já aparecem no quadro da loja (publicado em 2026-10-09). Todos os outros botões de WhatsApp continuam indo pro (61) 99626-5726
- Instagram: [@ciapel.papelaria](https://www.instagram.com/ciapel.papelaria/) — 11,7 mil seguidores, 714 posts
- Shopee: [Ciapel Papelaria, Loja Online](https://shopee.com.br/845lycnh9f) — na Shopee desde jun/2025 (16 meses em 2026-10-09), 71 produtos, **nota 5,0 com 2,9 mil avaliações**, 244 seguidores, responde 60% dos chats. Vende papelaria (lápis de cor, cadernos licenciados, DAS, Acrilex), balões, mochilas (Rebecca Bonbon, Capricho), copos de time, plastificadora e acessórios de informática. A Shopee só mostra a loja com login (o Gustavo entrou na conta dele no navegador pra conferir). Na página: seção própria "Mora longe? A Ciapel também está na Shopee." logo abaixo de Entregas (depois da faixa de números), com nota, avaliações e nº de produtos + ícone no rodapé (publicado em 2026-10-09). Argumento: local pede no WhatsApp (sem comissão), quem é de fora compra pela Shopee
- Sem site próprio (tem loja na Shopee, ver acima)

## Horário (story "Horário" do Instagram)

- Segunda a sexta: 8h30 às 18h
- Sábado: 8h30 às 16h
- Domingo: fechado
- A copiadora encerra 30 min antes do fechamento da loja

## Observações pra abordagem

- No Google, a ficha de Sobradinho I usa o Facebook como "site", e a de
  Sobradinho II nem foi reivindicada. Isso dá gancho pra vender **presença digital**
  (site + Google Meu Negócio), não só a página
- Avaliação recente no Google reclama que a copiadora fechou antes do
  horário do Google. O aviso dos 30 min existe só num story. A página deixa isso
  claro, o que serve como argumento sem precisar criticar a loja
- Uma avaliação menciona "a proprietária". Confirmar com quem falar antes de
  mandar a mensagem

## Mockup (2026-10-08)

- Página única em HTML/CSS estático: `mockup/index.html`
- Fotos reais baixadas do Instagram público: `mockup/assets/fotos/`
- Screenshots: `mockup/screenshots/` (`mobile.png` é o teaser pro WhatsApp)
- Mensagem de abordagem: `mockup/abordagem.md`
- Seções: barra de anúncio, header, hero com colagem de produtos + mascote,
  categorias, novidades (8 produtos reais, botão "Quero esse" abre o WhatsApp
  com o nome do produto), lista escolar pelo WhatsApp, personalizados,
  entregas, números reais, duas lojas + mapa, CTA final, rodapé
- Preço real usado: Kit Bobbie Goods R$ 15,00 (post de 14/08/2026). Os outros
  produtos ficaram como "Consulte"

## Checklist

- [x] Levantar dados reais (Instagram, Google Maps)
- [x] Mockup da landing page
- [x] Screenshots mobile e desktop
- [x] Rascunho da mensagem de abordagem
- [ ] Confirmar com quem falar (dono/dona ou responsável)
- [ ] Confirmar com a loja: serviço de lista escolar pelo WhatsApp (seção
      sugerida, não estava anunciada assim) e se o horário vale pras duas lojas
- [ ] Enviar abordagem pelo WhatsApp da loja (texto final em `mockup/abordagem.md`)
- [x] Publicar o mockup na Vercel (2026-10-08): https://ciapel-papelaria.vercel.app
- [x] Definir preço da landing page: R$ 1.500 no Pix ou 3x de R$ 550, com o 1º mês de anúncio no Google incluso (até R$ 200) e o domínio do 1º ano (+ R$ 150/mês opcional pra atualizar as novidades), 2026-10-09. Detalhes em `mockup/abordagem.md`. O ciapel.com.br é de outra empresa: usar ciapelpapelaria.com.br (livre em 2026-10-09)

## Publicação (Vercel)

- Projeto `ciapel-papelaria` no time `glsmteste`, publicado a partir de
  `mockup/` pela CLI (`npx vercel deploy --prod --scope glsmteste` dentro da pasta)
- **GitHub desconectado de propósito.** O `vercel link` conectou o repo GLSM
  inteiro com Root Directory "." e, no próximo push, publicaria o repositório
  todo (memória, briefings, abordagens). Se um dia quiser deploy automático,
  definir antes o Root Directory como `clientes/Ciapel-Papelaria/mockup` no
  painel da Vercel
- `.vercelignore` deixa `abordagem.md`, `screenshots/` e `.env*` fora do site
  (conferido: dão 404)
- Página com `noindex` (não aparece no Google enquanto for demonstração). Tirar
  a tag quando virar o site oficial
- Pasta renomeada de `clientes/ciapel papelaria/` pra `clientes/Ciapel-Papelaria/`
  em 2026-10-09 (padrão das outras pastas). O site no ar não muda. No
  computador local, a pasta oculta `mockup/.vercel` (link com o projeto, fora
  do git) fica na pasta antiga: mover pra `clientes/Ciapel-Papelaria/mockup/`
  ou, no próximo deploy, linkar ao projeto existente `ciapel-papelaria` (nunca
  criar um novo)
