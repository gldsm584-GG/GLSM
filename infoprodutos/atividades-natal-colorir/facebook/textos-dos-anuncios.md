# Texto dos anúncios (Meta)

Os anúncios são feitos no GPT (prompts em `../anuncios/prompts-gpt.md`) e ficam em `fotos/`, todos
no formato 4:5 do feed (1122x1402). Ainda não há versão stories (9:16): o prompt para fazer está no
fim do `prompts-gpt.md`.

| Anúncio | Imagem | Texto principal |
|---|---|---|
| 01, "Uma ideia criativa para o Natal" | `fotos/anuncio-01-ideia-criativa.png` | Versões A e B |
| 02, "Atividades de Natal prontas pra imprimir" (folhas de atividades) | `fotos/anuncio-02-casa-ou-escola.png` | Versões A e B |
| 03, mesmo título do 02, mostrando o kit todo | `fotos/anuncio-03-kit-completo.png` | Versões A e B |
| 04, "Atividade de Natal? É só imprimir!" (impressora) | `fotos/anuncio-04-so-imprimir.png` | Versões A e B |
| 05, "Recorte e monte a magia do Natal" (20 moldes) | `fotos/anuncio-05-moldes.png` | Versões A e B |

No Meta dá para cadastrar até 5 versões de cada campo: cadastre as duas e ele testa sozinho. Quando
houver a versão stories, suba junto com a do feed no mesmo anúncio (o Meta usa cada uma no lugar
certo).

Sem hashtag: em anúncio, hashtag é um link que tira a pessoa do anúncio.

---

## Texto principal

**Versão A (curta)**

Atividade de Natal pronta pra usar em casa ou na escola. É só imprimir. 🎄

O Natal Mágico traz 15 desenhos para colorir, 20 moldes natalinos para recortar e 10 atividades,
como caça-palavras, labirinto, jogo da memória, bingo e cartinha para o Papai Noel.

PDF por R$ 19,90. Chega no seu e-mail logo depois da compra, e você imprime quantas vezes quiser.

**Versão B (detalhada, com emoji)**

O Meta corta o texto depois da 1ª ou 2ª linha ("Ver mais"): o gancho tem que estar no começo.

🎄 Atividade de Natal pronta, em casa ou na escola: é só imprimir.

Dezembro chega e o tempo some. Em vez de passar a noite procurando atividade na internet, você
já tem tudo num arquivo só, para imprimir quando quiser.

📗 O Natal Mágico tem 45 recursos de Natal:
✅ 15 desenhos para colorir (Papai Noel, rena, boneco de neve, pinguim, casa de gengibre e mais)
✅ 20 moldes natalinos para recortar e decorar
✅ 10 atividades: caça-palavras, labirinto, ligue à sombra, conte os enfeites, sudoku de figuras,
jogo da memória, bingo de Natal, cartinha para o Papai Noel, decore a árvore e complete o desenho

🖨️ Imprima quantas vezes quiser.
📩 PDF que chega no seu e-mail logo depois da compra.

👉 R$ 19,90, pagamento único. Toque em Comprar agora.

---

## Título (até 40 caracteres)

- Atividades de Natal prontas
- Natal Mágico: 45 recursos pra imprimir
- Em casa ou na escola, é só imprimir

## Descrição

- PDF · R$ 19,90 · chega no e-mail

## Botão

- **Comprar agora** (a página já leva direto para o checkout da Wiapy)

## Link

- https://natal-magico-gamma.vercel.app
- Parâmetros de URL (opcional, no campo "Parâmetros de URL" do anúncio):
  `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`.
  A página repassa `utm_*` e `fbclid` para o checkout.

---

## Antes de subir

- **Pixel no checkout da Wiapy ligado** e compra de teste com o `Purchase` aparecendo no
  Gerenciador de Eventos (itens 4 e 5 da seção 6 do `estrutura.md`). A página de venda ainda não
  tem o Pixel (item 2).
- **Desmarcar a Audience Network** em Posicionamentos e desligar o "Permitir gasto limitado em
  posicionamentos excluídos". Nas frutíferas, 96% dos cliques vieram dela e não compraram (ver
  `frutiferas-em-vaso/anuncios/relatorios/2026-10-29-relatorio.md`).
- As peças não falam de garantia: ela ainda não foi conferida na Wiapy (item 1 da seção 6). Se
  confirmar, dá para pôr "Garantia de 7 dias" no cartão e no fim da Versão B.
