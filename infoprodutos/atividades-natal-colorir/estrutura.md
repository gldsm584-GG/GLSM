# Natal Mágico (kit de Natal para a família)

Segundo infoproduto do Gustavo. Ebook digital em PDF para imprimir, para
a família fazer com as crianças em casa: **15 desenhos para colorir + 20
moldes natalinos + 10 atividades extras = 45 recursos**, por R$ 19,90,
vendido pela **Wiapy** (decidido em 2026-11-01; a frutíferas continua na
Kiwify).

Começou em 2026-10-31 como *Semana de Natal Pronta*, um kit para
professora de pré-escola com roteiro por dia e BNCC. Antes do lançamento
o Gustavo trocou pela versão família, com a página modelada na
[Ebook Natalino](https://ebooknatalino.lovable.app) (estrutura da página
igual, textos, desenhos e imagens próprios). Os arquivos da versão
professora continuam na pasta e **não fazem parte do produto**:
`00-como-usar.md`, `dia-1` a `dia-5`, `historia-a-estrela-de-todo-mundo.md`,
`bonus-01-registro-da-semana.md` e `lista-de-ilustracoes.md`.

É produto de temporada. A janela de venda vai de ~10/11 a ~12/12. Os
concorrentes já anunciam desde o fim de outubro.

---

## 1. Concorrentes (páginas abertas em 2026-10-31)

| Oferta | Preço | O que entrega | Público | Sinal de venda |
|---|---|---|---|---|
| [Kit Natal Divertido](https://lapisdecorkids.com.br) (Lápis de Cor Kids) | R$ 19,90 | 107 páginas: 90 atividades em 8 temas (coordenação, letras, números, raciocínio, 16 desenhos de colorir, recorte, Natal cristão, Natal do Brasil) + 17 de bônus (bingo de 30 cartelas, painel da porta, cartão, certificado). PDF colorido + P&B | mãe **e** professora | 3 criativos desde 23/10. É o concorrente mais forte e mais bem feito |
| [Natal sem Tela](https://natal-sem-tela.vercel.app) | R$ 14,90 ("de R$ 97") | 24 noites: história curta com personagens próprios + 1 atividade por noite, enfeites, certificado. Sem tema religioso | mãe, 3 a 7 anos | 2 cópias desde 30/10 |
| [Calendário do Advento](https://calendario-advento.vercel.app) (O Clube das Atividades) | R$ 29,90 ("de R$ 89") | calendário de janelas/cartões (colorido e para colorir) + devocional de 25 dias + caderno de 17 atividades | família cristã | 4 criativos diferentes desde 31/10 |
| [Ebook Natalino](https://ebooknatalino.lovable.app) (natalcriativo.br) | R$ 19,90 | 25 desenhos + 30 moldes + 10 atividades | mãe | 3 cópias desde 20/10 |
| Pack Natalino | não aparece | "+100 atividades natalinas prontas" para a sala | professora | 11 cópias. A página do anúncio (renovapost.com) é um WordPress vazio |
| Kit Natal Mágico (Professora preparada) | R$ 12 | bingo, memória, dominó, caça-palavras | professora | 3 cópias (a página não abriu) |
| Super Kit Natal Encantado (Clubinho Kids) | R$ 9,90 | painéis, caixinhas, lembrancinhas | professora e mãe | 14 cópias |
| Infância Católica | R$ 19,90 o livro; R$ 39,90 o combo | livros de atividades, Advento, Novena, alinhavo | família católica | 6+ criativos |

---

## 2. O que o kit entrega (pronto em 2026-11-01)

Os 3 PDFs em `entregaveis/` são o produto:

1. **`1 - Desenhos para colorir.pdf`**: 15 páginas, 15,8 MB. Um desenho
   por página, das imagens em `desenhos/`.
2. **`2 - Moldes para recortar.pdf`**: 4 páginas com 5 moldes cada (20
   moldes), das folhas em `moldes/`. A folha com alça em cima dos moldes
   foi tirada a pedido do Gustavo e está em `moldes/sem-uso/`.
3. **`3 - Atividades.pdf`**: 12 páginas, 1,6 MB, com 10 atividades:
   1. Caça-palavras 10×10 (NATAL, NEVE, SINO, RENA, ESTRELA, PRESENTE, VELA, GORRO)
   2. Labirinto
   3. Ligue cada desenho à sua sombra
   4. Conte os enfeites
   5. Sudoku 4×4 com figuras para recortar
   6. Jogo da memória (12 pares)
   7. Bingo de Natal (4 cartelas + página de fichas)
   8. Cartinha para o Papai Noel
   9. Decore a árvore (árvore para colorir + 20 enfeites para recortar e colar)
   10. Complete o desenho (6 desenhos pela metade)

As imagens são geradas pelo Gustavo no GPT, com prompts escritos pelo
Claude, e salvas nas pastas. O Claude recorta, ajusta e monta os PDFs.

**Como gerar os PDFs de novo** (nesta pasta; usa o Chromium do Playwright):

```bash
node montar-pdf.mjs desenhos "entregaveis/1 - Desenhos para colorir.pdf"
node montar-pdf.mjs moldes "entregaveis/2 - Moldes para recortar.pdf"
cd atividades && node gerar-icones.mjs && node montar.mjs
```

- `montar-pdf.mjs` põe os .png da pasta em A4, um por página (os
  numerados primeiro), com `brightness(1.05)` para deixar o fundo branco.
- `atividades/gerar-icones.mjs` recorta os desenhos das folhas de moldes e
  da grade em `atividades/atividade 9/` para `atividades/icones/`
  (traço, sombra e versão com pontilhado de recorte).
- `atividades/montar.mjs` monta as 10 atividades, sorteia com semente fixa
  e confere caça-palavras, labirinto, sudoku e contagem antes de gerar o
  PDF e as prévias em `atividades/previa/`.

### Order bump: Caixinhas de Natal para presentear (R$ 4,90)

Decidido em 2026-11-01. Retoma a ideia do Kit Natal Doce (cancelado em
30/10), agora como extra no checkout para a família. É todo colorido:
`entregaveis/Caixinhas de Natal para presentear.pdf`, com 6 páginas (capa,
passo a passo ilustrado e 4 caixinhas de bombom de 5 x 5 x 5 cm com 3 tags
do mesmo tema cada). Temas: Papai Noel, rena, boneco de neve e árvore. Em
2026-11-02 o Gustavo tirou as faixas para barra de chocolate ("ninguém vai
usar") e baixou o preço de R$ 6,90 para R$ 4,90.

Os 4 desenhos foram feitos pelo Gustavo no GPT e estão em `caixinhas/arte/`.
O molde da caixa (corte e dobra) é desenhado em código, não pelo GPT. Para
gerar de novo: `cd caixinhas && node montar.mjs`. Na primeira vez o script
tira o fundo branco dos desenhos e cria os `*-adesivo.png`.

O PDF é feito de imagens de 300 dpi de cada página: impresso direto em vetor,
o leitor de PDF do app (pdf.js) não desenhava fundos com degradê/transparência
e sumia com partes da página. O passo a passo mostra a caixinha em 3D com a
arte de verdade, porque a primeira versão, com desenhos simples, ficou com
"cara de IA de 50 centavos" para o Gustavo.

### Order bump 2: Kit "Papai Noel passou aqui" (R$ 5,80, no ar desde 2026-11-02)

Ideia escolhida pelo Gustavo para o segundo bump (planejado a R$ 4,90, subiu a
R$ 5,80): material para os
pais fazerem a magia na noite de Natal. Itens propostos: carta do Papai Noel
para a criança (com espaço para o nome), bilhete "Obrigado pelos biscoitos!",
molde de pegadas de bota (para marcar com farinha), placa "Papai Noel, pare
aqui!" para a porta, certificado "Criança do Bem 2026" e etiquetas de
presente "Do Papai Noel" (letra impressa, para a criança não reconhecer a
letra dos pais).

- [x] **Gustavo decidiu:** kit completo
- [x] **Gustavo:** gerou no GPT o prompt 1 abaixo (Papai Noel escrevendo).
  A bota, o selo, o carimbo e as pegadas de rena acabaram desenhados em
  código, então não precisou de mais imagem
- [x] **Claude:** montou `entregaveis/Kit Papai Noel passou aqui.pdf`, com 8
  páginas: capa, roteiro "Como fazer a magia na noite de Natal" (6 passos e
  2 dicas para os adultos), carta do Papai Noel, certificado "Criança do Bem
  2026", placa "Papai Noel, PARE AQUI!" (placa de trânsito com "Aqui mora:"
  para a criança escrever), bilhetes de agradecimento (biscoitos e
  cenouras), 12 etiquetas "Do Papai Noel" e molde da bota em tamanho real
  (vira a folha para o outro pé). Os textos não têm gênero ("Olá, ___!",
  "essa pessoa") para servir para menino ou menina
- [x] Conteúdo + orderbump na Wiapy, marcado no produto (2026-11-02; ver o
  item 9 da seção 6)
- [ ] **Gustavo:** imprimir a carta e o molde da bota para conferir o tamanho

Para gerar de novo: `cd papai-noel-passou && node montar.mjs`. A arte fica em
`papai-noel-passou/arte/` (fora do git) e os outros personagens vêm de
`caixinhas/arte/`. O que as duas pastas usam em comum (cores, fundos, adesivo,
PDF feito de imagens de 300 dpi) está em `comum.mjs`.

Prompt 1 (Papai Noel escrevendo a carta, colorido):

```
Crie uma ilustração de Natal no mesmo estilo da imagem anexada: mesmo contorno preto grosso, mesma pintura chapada e viva, mesmas cores e o mesmo Papai Noel fofo, com olhinhos fechados sorrindo e bochechas rosadas.

O desenho: o Papai Noel sentado atrás de uma escrivaninha de madeira, visto de frente, da cintura para cima, escrevendo uma carta com uma pena dourada. Ele usa óculos redondos pequenos na ponta do nariz. Em cima da mesa há uma folha de papel comprida, um tinteiro e uma pilha de 3 envelopes vermelhos com selo dourado.

Cores: vermelho (#d4332b), verde (#1d5a3c), dourado (#f5c542), branco, marrom da madeira e tom de pele claro. Pintura chapada, como adesivo.

Regras:
- Fundo totalmente branco, sem cenário e sem sombra no chão.
- Desenho centralizado, ocupando uns 80% da imagem, sem nada encostando na borda.
- Sem texto escrito na carta nem em lugar nenhum, sem moldura e sem linha pontilhada em volta.
- Imagem quadrada (1:1).
```

---

## 3. Página de venda

`pagina-de-venda/index.html` (com `noindex`), imagens em
`pagina-de-venda/img/` (`capa`, `mesa`, `desenhos`, `moldes`, `atividades`;
a `atividades` saiu do GPT com as prévias reais do caça-palavras, do
labirinto e da sombra anexadas, original em
`atividades/Atividades Natalinas na Mesa de Madeira.png`). Para ver no
painel: servidor `natal-pagina-de-venda` do `.claude/launch.json` (porta
4325).

Favicon (2026-11-03): o rosto do Papai Noel dos order bumps sobre um
quadrado verde, em `favicon.ico` (16, 32 e 48 px), `favicon.png` (192 px)
e `apple-touch-icon.png` (180 px) dentro de `pagina-de-venda/`. Para gerar
de novo: `node favicon.mjs` nesta pasta (usa `caixinhas/arte/`).

Ordem das seções: faixa do topo, capa com chamada, o que você vai receber
(15/20/10), vantagens, foto da mesa, como funciona, oferta (R$ 19,90, sem
parcelamento), galeria, perguntas frequentes e chamada final.

Não usar depoimento inventado nem "de R$ 97 por R$ 19,90" se o kit nunca
foi vendido a R$ 97 (Código de Defesa do Consumidor). A galeria mostra só
o material até chegarem depoimentos reais.

---

## 4. Preço e venda

- **Preço:** R$ 19,90, igual ao dos concorrentes diretos.
- **Plataforma:** Wiapy. Pela ajuda dela, cartão custa R$ 1,49 + 4,99% por
  venda (~R$ 2,48 nos R$ 19,90); o Pix tem faixas por valor e o saque
  custa R$ 3,67. Conferir no painel, as páginas da Wiapy não batem entre
  si em alguns valores.
- **Pixel:** a Wiapy configura o Pixel do Facebook no próprio checkout. A
  compra de teste precisa mostrar o `Purchase` no Gerenciador de Eventos.
- **Licença:** uso na família ou na turma de quem comprou (a professora pode
  imprimir uma cópia para cada aluno; decidido em 2026-11-03 por causa dos
  anúncios 11 e 25). Pode imprimir quantas vezes quiser; não pode revender
  nem repassar o arquivo.
- **Garantia:** 7 dias.

---

## 5. Cuidados com o anúncio (política da Meta)

- Não afirmar religião, idade, condição financeira ou outra
  característica pessoal de quem lê ("Você que é cristã...").
- Não usar foto de criança real nos criativos sem autorização dos pais.
  Mostrar as folhas, a mesa e mãos pintando.
- Não prometer resultado ("seu filho vai aprender..."). Falar do que o kit
  entrega.

---

## 6. O que falta para lançar (2026-11-01)

1. [x] **Produto na Wiapy** (2026-11-01). Conta ativa (pessoa física,
   Nubank 260, agência 0001). *Conteúdo entregável* "Natal Mágico" (E-book,
   categoria Educacional, capa `capa-wiapy-1080x1920.jpg`, os 3 PDFs) e
   *produto* "Natal Mágico" (pagamento único, Pix + cartão, R$ 19,90, 1x,
   suporte gldsm584@gmail.com, nome de exibição "Natal Mágico", tema Light,
   thumb `thumb-wiapy-800x800.jpg`). Checkout:
   **https://pay.wiapy.com/6ae7abc92da3da6ee2ed677b**. Na ativação, o
   Complemento do endereço é obrigatório mesmo sem asterisco.
   - [x] E-mail de suporte confirmado em 2026-11-01; checkout aberto
     (R$ 19,90 à vista, Pix, cartão e Google Pay)
   - [ ] Garantia de 7 dias: não apareceu no formulário do produto; conferir
     na Wiapy
2. [ ] **Claude:** link do checkout no botão `data-checkout` da oferta
   (feito em 2026-11-01; o script da página repassa `fbclid` e `utm_*`).
   Meta Pixel "Natal Mágico" (991211670703665) colocado no `<head>` em
   2026-11-02, com o PageView conferido no preview, e republicado na Vercel
   com OK do Gustavo no mesmo dia (200, noindex e Pixel conferidos com
   `curl`). Em 2026-11-03 o FAQ "Posso imprimir?" passou a dizer que vale
   para a família ou a turma da escola, sem revender nem repassar (ver a
   licença na seção 4), e foi republicado com OK do Gustavo (200, noindex,
   Pixel e FAQ conferidos com `curl`). Em 2026-11-04 os 4 botões de compra
   passaram a mandar `InitiateCheckout` (R$ 19,90 BRL) ao Pixel no clique,
   porque a Wiapy só manda a compra aprovada e a coluna "Finalizações de
   compra iniciadas" do Gerenciador ficava sempre em "—". Republicado com OK
   do Gustavo (200, noindex e Pixel conferidos com `curl`; o evento saiu
   para `facebook.com/tr` no clique, conferido no navegador). Faltam o
   rodapé com o nome do vendedor e a política de privacidade
3. [x] **Claude, com OK do Gustavo:** publicar `pagina-de-venda/` na
   Vercel com `noindex`. No ar desde 2026-11-01 em
   https://natal-magico-gamma.vercel.app (projeto `natal-magico`, o nome
   `natal-magico.vercel.app` já era de outro). O 1º deploy ligou o GitHub
   sozinho; desligado com `npx vercel git disconnect --yes --scope
   glsmteste`. Republicar com `npx vercel deploy --prod --scope glsmteste`
   de dentro da pasta e conferir com `curl`
4. [ ] **Pixel na Wiapy.** Fica em Integrações → Facebook Ads (não nas
   configurações do checkout). Detalhes nas partes 2 e 3 do
   `facebook/subir-campanha.md`
   - [x] Pixel novo "Natal Mágico" criado em 2026-11-02 no portfólio do
     Natal: **ID 991211670703665** (não é o das frutíferas)
   - [x] Pixel conectado à conta de anúncios Natal Magico e já recebendo
     eventos (conferido na BM em 2026-11-02)
   - [x] Integração "Pixel Natal Mágico" salva na Wiapy pelo Claude a pedido
     do Gustavo (2026-11-02): produto Natal Mágico, Pixel 991211670703665, só
     o evento "Pagamento aprovado"
   - [x] Token da API de Conversões gerado e colado na integração pelo
     Gustavo (2026-11-02; conferido pelo Claude: salvo, começa com `EAA`). No
     Gerenciador de Eventos a API de Conversões fica "Conexão pendente" até
     chegar o primeiro evento do servidor, que vem com a compra de teste
5. [ ] **Compra de teste: o Gustavo decidiu não fazer** (2026-11-03). A
   primeira venda de verdade vale como teste. Conferir na Wiapy que ela saiu
   paga e com os PDFs entregues, que o `Purchase` aparece no Gerenciador de
   Eventos em até ~30 min e que a venda aparece nos Pedidos da Utmify. Se o
   `Purchase` não chegar, mandar print para o Claude: sem ele o Meta
   otimiza as campanhas no escuro
   - [x] 1ª venda em 2026-11-05 às 06:56, Pix, sem order bump: paga na
     Wiapy (R$ 18,40 líquidos), `Purchase` enviado às 07:52 (log 200) e
     contado no Meta na campanha `natal M 1-1-10 3` (valor R$ 19,90), e
     nos Pedidos da Utmify na mesma campanha. Entrega dos PDFs não
     conferida
6. [x] **Criativos e textos dos anúncios** (2026-11-02). Os feitos em
   código (HTML) ficaram ruins e foram apagados; os anúncios são feitos
   pelo Gustavo no GPT, com prompts do Claude em `anuncios/prompts-gpt.md`.
   31 prontos no feed 4:5 em `facebook/fotos/` (`anuncio-01` é só
   imprimir, `anuncio-02` pinte, recorte e brinque, `anuncio-03` 45
   recursos, `anuncio-04` menos tela, `anuncio-05` férias de dezembro,
   `anuncio-06` chuva, `anuncio-07` oficina, `anuncio-08` árvore de
   folhas, `anuncio-09` noite de jogos, `anuncio-10` antes e depois,
   `anuncio-11` casa ou escola, `anuncio-12` decoração, `anuncio-13`
   quantas vezes quiser, `anuncio-14` quanta coisa, `anuncio-15` ceia,
   `anuncio-16` Natal chegando, `anuncio-17` mesa das crianças,
   `anuncio-18` primos, `anuncio-19` viagem, `anuncio-20` menos de
   R$ 20, `anuncio-21` organizado, `anuncio-22` café em paz,
   `anuncio-23` manhã de Natal, `anuncio-24` calor, `anuncio-25` festa da
   turma, `anuncio-26` chega no e-mail, `anuncio-27` uma por dia,
   `anuncio-28` geladeira, `anuncio-29` cabaninha, `anuncio-30`
   personagens, `anuncio-31` acabaram as aulas). Renumerados de 01 a 31
   em 2026-11-03, na ordem em que foram feitos; as 3 levas de prompts
   estão completas. O título do 21 ("num PDF só") e o do 08 ("num PDF")
   não são exatos: o kit chega em 3 PDFs (desenhos, moldes, atividades).
   O título do 19 ("Leva o kit impresso") pode dar a ideia de que o kit
   chega impresso; o 27 tem uma igrejinha, e o kit não tem desenho
   religioso. Os quatro dá para corrigir no GPT pedindo a troca só daquilo.
   O GPT tende a trocar a capa e a desenhar os jogos como peças de
   papelão colorido: conferir que é a capa real e que tudo é papel
   impresso. Conferir se o GPT não inventa item que o kit não tem (na 1ª
   versão do 07 apareceu um quebra-cabeça; na do 14, máscara de rena e
   caixinha para montar, que é o order bump vendido à parte).
   Os primeiros anúncios, que falavam de uma parte só, foram apagados:
   todo anúncio tem que mostrar os 15 desenhos + 20 moldes + 10
   atividades e "Tudo em PDF por R$ 19,90". Um da cartinha foi gerado e
   reprovado: a cartinha dominou a cena.
   Vídeo: em 2026-11-03 um vídeo narrado de 15 s, feito em Remotion porque
   o GPT não faz mais vídeo (a OpenAI encerrou o Sora), ficou ruim e foi
   apagado. Os anúncios ficam só nas imagens
   Textos (versões A e B, títulos, descrição, botão e o que conferir antes
   de subir) em `facebook/textos-dos-anuncios.md`. Sem vídeo por enquanto,
   e sem "Garantia de 7 dias" nas peças até conferir na Wiapy
   - [ ] **Gustavo:** versões stories (9:16) no GPT, com o prompt do fim do
     `prompts-gpt.md`
7. [x] **Gustavo:** subir a campanha no Meta até ~10/11, seguindo
   `facebook/subir-campanha.md` (configuração campo a campo, 5 anúncios, um
   por imagem, e o que olhar nos primeiros dias)
   - [x] Portfólio empresarial e conta de anúncios próprios (2026-11-02):
     portfólio **Natal Mágico** (ID 1143226331510175; nasceu "Nalta Magico" e
     o Claude corrigiu o nome com OK do Gustavo), conta **Natal Magico** (ID
     1673299994454815) e página Natal Mágico (ID 1317618054778354), todas no
     portfólio. A conta das frutíferas não é usada no Natal
   - [ ] Pagamento: a conta é pré-paga, com R$ 200 de saldo (Pix do Nubank
     em 2026-11-02) e nenhum cartão em 2026-11-03. Quando o saldo acaba, os
     anúncios pausam. A R$ 105/dia ele dura menos de 2 dias (o plano era
     R$ 20/dia, com limite de perda de R$ 100). Orçamento e saldo são decisão
     do Gustavo
   - [x] **Gustavo:** montou 3 campanhas em rascunho (2026-11-03), em vez dos
     5 anúncios do `subir-campanha.md`: `natal M 1-1-10 1`, `2` e `3`, cada
     uma com 1 conjunto (`inteligente 1`, `2` e `3`) e 10 anúncios, um por
     imagem (`Natal Mágico 21` a `30`, `Natal Mágico2 11` a `20` e
     `Natal Mágico 1` a `10`; o 31 ficou de fora). Campanha de vendas
     Advantage+, orçamento da campanha de R$ 35/dia cada (R$ 105/dia no
     total), início em 04/11 à 00h e sem data de término. Conjuntos: Site,
     Pixel Natal Mágico, evento **Compra**, Brasil aberto, só Facebook e
     Instagram. Anúncios com os textos A e B, os 3 títulos, a descrição, as
     UTMs e o botão **Comprar agora**
   - [x] **Claude:** revisão dos rascunhos com o Gustavo (2026-11-03). O
     Claude trocou o botão dos 30 para Comprar agora (estavam "Ver detalhes"
     e "Saiba mais", e a Versão B manda tocar em "Comprar agora"), desligou
     o "Permitir gasto limitado em posicionamentos excluídos" nos 3 conjuntos
     e tirou a programação própria dos anúncios 7, 8 e 9 (começava em 03/11
     às 11h08 e travava a publicação). O Gustavo trocou o evento de "Iniciar
     finalização da compra" para Compra e pôs as UTMs nos anúncios 1 a 6.
     Nada publicado
   - [x] **Gustavo:** publicou as 3 campanhas em 2026-11-03, sem a compra de
     teste (ver o item 5). Conferido pelo Claude logo depois: as campanhas
     estão como "Programado", não sobrou nenhum rascunho e os 30 anúncios
     estão "Em análise" ou "Em processamento", sem nenhum reprovado. Rodam a
     partir de 04/11 à 00h
   - [ ] Nos 3 primeiros dias, não mexer em orçamento, público nem anúncios.
     Com ~R$ 60 gastos, mandar ao Claude o print no nível Anúncios
     (`/relatorio-ads`; colunas na parte 7 do `subir-campanha.md`)
8. [x] **Order bump das caixinhas na Wiapy** (2026-11-02). Conteúdo
   entregável "Caixinhas de Natal para presentear" (E-book, Hobbies, capa
   `capa-bump-caixinhas-1080x1920.png`, o PDF) e orderbump de R$ 4,90 com
   thumb `thumb-bump-caixinhas.png`, marcado no produto Natal Mágico. O
   "valor promocional fictício" é obrigatório: o Gustavo escolheu R$ 6,00, e o
   checkout mostra "De R$ 6,00 por R$ 4,90" (o kit nunca foi vendido a
   R$ 6,00; ver a regra de "de/por" na seção 3). A chamada padrão da Wiapy
   ("COM 90% DE DESCONTO") foi trocada por "APROVEITE E LEVE JUNTO POR SÓ
   R$ 4,90". Os 2 PNGs saem do `caixinhas/montar.mjs`
   - [ ] **Gustavo:** imprimir e montar uma caixinha para conferir se fecha
     certo, e na compra de teste marcar o bump e ver se chegam os 2 PDFs
9. [x] **Order bump do Kit "Papai Noel passou aqui" na Wiapy** (2026-11-02).
   Conteúdo entregável "Kit Papai Noel passou aqui" (E-book, Hobbies, capa
   `capa-bump-papai-noel-1080x1920.png`, o PDF) e orderbump com thumb
   `thumb-bump-papai-noel.png`, marcado no produto Natal Mágico junto com o
   das caixinhas. O Gustavo definiu o preço: "De R$ 7,60 por R$ 5,80" (o kit
   nunca foi vendido a R$ 7,60). Como o CTA dos orderbumps é um só para o
   produto, "APROVEITE E LEVE JUNTO POR SÓ R$ 4,90" virou "APROVEITE E LEVE
   JUNTO", sem preço. Conferido no checkout público
   - [ ] **Gustavo:** na compra de teste, marcar os 2 bumps e ver se chegam
     os 3 PDFs (Natal Mágico, caixinhas e kit)
10. [ ] **Página no Facebook "Natal Mágico"** (kit pronto em 2026-11-02 em
    `facebook/pagina-do-facebook.md`: nome, categoria, bio, botão, 5 posts e
    passo a passo). O recorte da capa do ebook como foto de perfil foi
    reprovado; a foto e a capa saem do GPT com os prompts do kit
    - [ ] **Gustavo:** fazer a foto de perfil no GPT e salvar como
      `facebook/foto-perfil.png` (o Claude confere no círculo)
    - [ ] **Gustavo:** fazer a arte da capa no GPT com o prompt do kit e salvar
      como `facebook/capa-gpt.png` (o Claude recorta em 1640x624)
    - [x] **Gustavo:** página criada (2026-11-02)
    - [ ] **Gustavo:** pôr o botão e publicar os 5 posts antes de subir a
      campanha (item 7)
11. [x] **Utmify** (2026-11-03). Credencial "Wiapy Natal Mágico" criada pelo
    Gustavo e colada na integração Utmify da Wiapy (produto Natal Mágico,
    eventos pendente, aprovado, estornado e chargeback; token conferido
    pelo Claude). Na Utmify, só a conta de anúncios Natal Magico ligada (o
    Claude trocou com OK do Gustavo: estava ligada uma conta desabilitada).
    Sem script de UTMs (a página já repassa) e sem o Pixel da Utmify (a
    compra contaria duas vezes). Os parâmetros de URL dos anúncios mudaram
    para o formato da Utmify, com nome, ID e o `cid` da conta. Detalhes na
    parte 5 do `facebook/subir-campanha.md`
    - [x] Assistente da Utmify terminado pelo Claude a pedido do Gustavo
      (2026-11-03): script de UTMs marcado como instalado, UTMs da Meta
      (o diagnóstico deu 0 erro porque ainda não há anúncio) e Pixel
      pulado. O aviso "Configuração incompleta" sumiu
    - [ ] **Gustavo:** depois de subir os anúncios, rodar de novo o
      diagnóstico de UTMs (Integrações → UTMs da Meta) para conferir os 5
    - [x] **Taxas** (2026-11-05): a 1ª venda chegou na Utmify já sem a
      taxa da Wiapy (R$ 18,40) e na campanha certa; o menu Taxas fica vazio.
      O Meta recebe o valor cheio (R$ 19,90) e a Wiapy não tem opção para
      mudar (parte 5 do `subir-campanha.md`)
