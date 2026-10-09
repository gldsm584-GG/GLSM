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

- WhatsApp (pedidos): **(61) 99626-5726**
- Fixos: (61) 3387-7784 · (61) 3591-9231
- Instagram: [@ciapel.papelaria](https://www.instagram.com/ciapel.papelaria/) — 11,7 mil seguidores, 714 posts
- Sem site próprio

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
- [ ] Enviar abordagem
- [x] Publicar o mockup na Vercel (2026-10-08): https://ciapel-papelaria.vercel.app
- [ ] Definir preço da landing page

## Publicação (Vercel)

- Projeto `ciapel-papelaria` no time `glsmteste`, publicado a partir de
  `mockup/` pela CLI (`npx vercel deploy --prod --scope glsmteste` dentro da pasta)
- **GitHub desconectado de propósito.** O `vercel link` conectou o repo GLSM
  inteiro com Root Directory "." e, no próximo push, publicaria o repositório
  todo (memória, briefings, abordagens). Se um dia quiser deploy automático,
  definir antes o Root Directory como `clientes/ciapel papelaria/mockup` no
  painel da Vercel
- `.vercelignore` deixa `abordagem.md`, `screenshots/` e `.env*` fora do site
  (conferido: dão 404)
- Página com `noindex` (não aparece no Google enquanto for demonstração). Tirar
  a tag quando virar o site oficial
