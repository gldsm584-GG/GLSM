# Vídeos feitos em código (vídeos 4 a 7)

Prontos para subir no Meta, sem CapCut e sem banco de imagem. Ilustração, animação, efeitos sonoros
e música são gerados por código, então não tem problema de licença. A narração é a voz feminina
"Dora" do Kokoro, um modelo de voz aberto (licença Apache 2.0, pode usar em anúncio).

| Vídeo | Formato | Duração | Arquivo (em `videos/`) | Texto do anúncio (`legenda.md`) |
|---|---|---|---|---|
| 4 — O jeito fácil | Tutorial em 5 passos | 36 s (27 s sem voz) | `video-4-jeito-facil-narrado.mp4` e `video-4-jeito-facil.mp4` | Versão C |
| 5 — Mito ou verdade | Jogo com 4 afirmações | 37 s | `video-5-mito-ou-verdade-narrado.mp4` | Versão D |
| 6 — A planta fala | A planta conta os próprios sinais | 28 s | `video-6-a-planta-fala-narrado.mp4` | Versão A |
| 7 — 6 frutíferas | Lista, uma fruta por vez | 36 s | `video-7-seis-frutiferas-narrado.mp4` | Versão E |

Todos em 1080x1920, 30 fps, com som em -16 LUFS. Os quatro terminam sem falar o preço, numa
curiosidade ("E os outros 3?", "Eu tenho outros sinais", "Quer ver as outras 6?"); o preço fica no
texto do anúncio. A pasta `videos/` não vai para o GitHub: se perder os arquivos, gere de novo.

---

## Como ver, mudar e gerar de novo

Cada vídeo tem uma pasta em `motion/` (`video-4-jeito-facil/`, `video-5-mito-ou-verdade/`...) com:

- `video.html`: o vídeo. Abra no navegador e clique em **Tocar** (com `?semvoz` no fim do endereço,
  toca sem narração). Textos na tela, desenhos, animação e efeitos ficam aqui.
- `falas.json`: a narração de cada cena (números por extenso, para a voz ler certo).
- `voz/`: a narração gravada (gerada a partir do `falas.json`).

O que é comum aos vídeos fica em `motion/motor.js` e `motion/motor.css`.

**Mudar a narração:** edite o `falas.json` e rode, dentro de `motion/`,
`python narrar.py video-5-mito-ou-verdade` (troque pelo nome da pasta). Cada cena estica ou encolhe
sozinha para caber a fala. Uma vez só: `pip install kokoro-onnx soundfile` e baixe os 2 arquivos do
modelo para `motion/modelos/` (links no começo do `narrar.py`).

Cuidado com a voz: ela às vezes engole a primeira consoante da frase ("Mito!" sai parecido com
"Bito!"). Por isso várias falas começam com "O", "É" ou "Na". Escute antes de publicar.

**Gerar o MP4:** dentro de `motion/`, `node render.mjs video-5-mito-ou-verdade` (narrado) ou com
`--sem-voz` no fim. Leva uns 9 minutos por vídeo. Precisa do Playwright (`npm i -g playwright` e
`npx playwright install chromium`) e do ffmpeg instalado.

**Área segura:** título e texto ficam entre 290 e 660 px de altura (e o resto do texto até 1300 px),
fora da interface do Reels e do corte 4:5 do feed.

---

## Vídeo 4 — "O jeito fácil" · 36 s narrado / 27 s sem voz

Os 5 passos do plantio, com o vaso em corte. Tem duas versões, boas para testar uma contra a outra.

| Cena | Na tela | Narração | Efeitos |
|---|---|---|---|
| Abertura | **O jeito fácil de plantar sua frutífera no vaso** · vaso, árvore crescendo e frutos aparecendo | Quer um pé de fruta no vaso? Olha o jeito fácil, em cinco passos. | Whoosh, baque do vaso, "pops" dos frutos, brilho |
| Passo 1 | **Compre muda enxertada** · muda de semente apaga com a etiqueta "8 a 15 anos" (jabuticaba); a enxertada ganha o círculo no enxerto e o ✓ | Compre muda enxertada. A jabuticabeira de semente leva de oito a quinze anos pra dar fruto. | Pops, "errado", "certo" |
| Passo 2 | **Tela no furo. Sem pedra no fundo** · pedras caem no vaso, levam um X e somem; entra a tela e a terra enche | Tela no furo, e nada de pedra no fundo: ela atrapalha a drenagem e encharca a raiz. | Pedras chacoalhando, "errado", terra caindo, "certo" |
| Passo 3 | **Colo no nível da terra** · muda desce no vaso, linha do colo e destaque do enxerto acima da terra | Deixe o colo no nível da terra, com o enxerto sempre de fora. | Whoosh descendo, baque, pops, "certo" |
| Passo 4 | **Regue até a água sair pelo furo** + teste do dedo (5 cm) · regador, terra escurecendo, água pingando do furo | Então, regue até a água sair pelo furo. Depois, use o teste do dedo. | Água e gotas, "certo" |
| Passo 5 | **No mínimo 6 horas de sol direto** · sol nasce, contador vai de 0 a 6 h | E no mínimo seis horas de sol direto por dia. | Subida, tiques do contador, "certo" |
| Resultado | **Começou certo. Agora é cuidar.** + "Mas tem erro que só aparece depois." · a muda vira árvore com frutos | Começou certo? Agora é cuidar. Mas tem erro que só aparece depois. | Subida, pops dos frutos, brilho |
| Fechamento (sem preço) | **Você viu 4 dos 7 erros que impedem o fruto** · lista dos 7 erros do cap. 1: os 4 do vídeo com ✓ e os 3 últimos trancados com cadeado; "E os outros 3?"; "Toque em Saiba mais" | Você viu quatro dos sete erros que impedem o fruto. Quer saber os outros três? Toque em saiba mais. | Pops, cadeados fechando, "hum?" sem resolver |

**Por que o final não fala o preço (mudado em 2026-10-22):** o vídeo termina numa curiosidade de
verdade em vez de vender. Ele mostra 4 dos 7 erros do cap. 1 (muda, vaso, sol e rega) e tranca os
outros 3 (adubo, poda e polinização), que estão no ebook. Quem clica vai por vontade própria, e o
preço aparece na página de venda. Para não estragar a surpresa, use neste vídeo a **Versão C** da
`legenda.md`: a Versão A lista os 7 erros.

## Vídeo 5 — "Mito ou verdade?" · 37 s

Jogo de auditório: cada afirmação aparece numa carta, um relógio conta quase 1 segundo para a pessoa
pensar, e o carimbo bate (MITO em vermelho, VERDADE em verde) com o motivo embaixo. Raios de luz
giram no fundo e o número da rodada fica no canto ("1/4"). A última é verdade, para quebrar o padrão.

| Rodada | Afirmação | Veredito e narração |
|---|---|---|
| Abertura | Carimbos MITO e VERDADE? + "4 afirmações. Quantas você acerta?" | Mito ou verdade? Teste o que você sabe de frutífera no vaso. |
| 1 | Pedra no fundo do vaso ajuda a drenar | **Mito.** É mito! A água para em cima da pedra e encharca a raiz. |
| 2 | Regar um pouquinho todo dia é o ideal | **Mito.** É mito! Regue fundo, até sair pelo furo. |
| 3 | Adubo de folhagem faz a planta dar mais fruto | **Mito.** É mito! Nitrogênio demais faz a planta só dar folha. |
| 4 | Dá pra ter pé de fruta em apartamento | **Verdade.** É verdade! Com no mínimo seis horas de sol direto no vaso. |
| Fechamento | "Quantas você acertou?" + o placar das 4 e o botão | Quantas você acertou? O guia derruba esses e outros mitos. Toque em saiba mais. |

Efeitos: tique da contagem, baque do carimbo, "errado" no mito e "certo" com brilho na verdade.
Música em lá menor, 128 BPM.

## Vídeo 6 — "A planta fala" · 28 s

A narração fala como se fosse a própria frutífera, em primeira pessoa, e a planta mostra cada sinal:
o vaso pula para dentro da cena e uma folha acena. Fundo claro (parede e chão), diferente dos outros
vídeos. Em 2026-10-25 o rosto do vaso (olhos e boca falando) saiu, a pedido do Gustavo.

| Cena | O que acontece | Narração |
|---|---|---|
| Oi | Pula para dentro e acena · **Oi! Presta atenção nos meus sinais** | Oi, eu sou a sua frutífera! Fruto que é bom, nada? Presta atenção nos meus sinais. |
| Sinal 1 | Aparece uma janela; a planta se inclina e se estica para ela · **Galho esticado pra janela?** | Se eu estico os galhos pra janela, é falta de sol. Eu preciso de no mínimo seis horas de sol direto. |
| Sinal 2 | A planta enche de folha escura e entra um saco de adubo com um N enorme · **Muita folha e nenhuma flor?** | Se eu fico linda, cheia de folha, e nenhuma flor, é o adubo com nitrogênio demais. |
| Sinal 3 | Abrem 7 flores, 3 caem girando, e um pincel passa nas que ficaram, soltando pólen · **Flor que cai sem virar fruto?** | E se eu encho de flor e elas caem sem virar fruto, pode ser falta de polinização. Um pincel macio, de flor em flor, ajuda. |
| Fechamento | **Eu tenho outros sinais...** + botão | Eu tenho outros sinais. E no guia tem o que fazer em cada um. Toque em saiba mais! |

Efeitos: mola no pulo, folhas brotando, "errado" no adubo, flores tilintando, assobio das flores
caindo, brilho do pólen. Música em dó maior, 104 BPM.

## Vídeo 7 — "6 frutíferas pro vaso" · 36 s

Uma fruta por vez, cada uma com a sua cor de fundo, desenhada grande e balançando, e um selo com o
"segredo" dela. Termina com as 12 fichas do guia: as 6 do vídeo abertas e 6 trancadas.

| Fruta (fundo) | Selo | Narração |
|---|---|---|
| Abertura (verde) | As 6 frutas girando em roda | Seis frutíferas pro vaso, e o segredo de cada uma. |
| Morango (vermelho) | Vaso "8 L" | O morango é o que menos espaço pede. Um vaso de oito litros já serve. |
| Limão Tahiti (verde-limão) | Medalha "1º" | O limão taiti, entre os citros, é o que começa a produzir mais cedo. |
| Jabuticaba (roxo) | Tesoura proibida no galho grosso; as frutas desenhadas grudadas no tronco | Na jabuticaba, o fruto nasce no tronco. Por isso, nunca corte galho grosso. |
| Figo (azul, com neve caindo) | Floco de neve | O figo dá fruto nos ramos do ano, e é podado forte no inverno. |
| Maracujá (verde-água, com a flor) | Pincel com pólen | O maracujá precisa do pólen de outra planta. Ou de você, com um pincel. |
| Mirtilo (azul-escuro) | Fita "pH 4,5–5,5" | O mirtilo gosta de terra ácida, com pH entre quatro e meio e cinco e meio. |
| Fechamento (verde) | 12 fichas, 6 trancadas · "Quer ver as outras 6?" | Essas são seis das doze fichas do guia. Quer ver as outras seis? Toque em saiba mais. |

Na fala, "Tahiti" está escrito "taiti" para a voz ler certo. Efeitos: mola em cada fruta, "certo"
nos selos ("errado" na tesoura da jabuticaba), cadeados no final. Música em dó maior, 120 BPM.

---

## De onde vêm os números

Todos estão no ebook, com a fonte no fim de cada capítulo:

- 8 a 15 anos da jabuticabeira de semente; muda de semente não sai igual à mãe (cap. 1, erro 1).
- Pedra no fundo atrapalha a drenagem (cap. 3); tela no furo, colo no nível da terra, enxerto acima,
  regar até sair água pelo furo (cap. 5); teste do dedo a 5 cm, regar fundo em vez de um pouco todo
  dia (cap. 6).
- 6 horas de sol direto e galho esticado para a janela (cap. 1, erro 3); folha sem flor e nitrogênio
  demais (erro 5); flor que cai e polinização com pincel (erro 7, que lembra que pode ser outra causa).
- Morango em vaso de 8 L (Embrapa/UFPel), limão 'Tahiti' o mais precoce dos citros (Embrapa),
  jabuticaba dá fruto no tronco, figo nos ramos do ano com poda forte no inverno, maracujá precisa de
  outra planta (Embrapa Cerrados), mirtilo com pH 4,5 a 5,5 (Embrapa): cap. 11.
