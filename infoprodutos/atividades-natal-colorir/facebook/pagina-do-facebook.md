# Página do Facebook "Natal Mágico"

Os anúncios do Meta saem em nome de uma Página: é o nome e a foto que aparecem em cima de cada anúncio
("Natal Mágico · Patrocinado"), e é para lá que vai quem toca no nome. Por isso a página precisa
parecer viva antes da campanha: foto, capa, botão de compra e uns 5 posts.

Quem cria e publica é o Gustavo (conta e publicação são dele). Tudo o que ele precisa colar ou enviar
está aqui.

---

## 1. Dados da página

| Campo | O que colocar |
|---|---|
| Nome da Página | **Natal Mágico** |
| Categoria | **Produto/serviço** (e, se der para pôr mais uma, **Site de educação**, a mesma da página das frutíferas) |
| Bio | `Kit de Natal em PDF pra imprimir: 15 desenhos para colorir, 20 moldes e 10 atividades 🎄` (87 caracteres) |
| Site | `https://natal-magico-gamma.vercel.app` |
| E-mail | o mesmo e-mail de suporte do produto na Wiapy |
| Telefone, endereço, horário | deixar em branco (produto digital) |
| Nome de usuário (@) | `natalmagicokit` (se estiver em uso: `natalmagico.atividades`) |
| Botão de ação | **Comprar agora** (se não aparecer, **Saiba mais**), levando ao site acima |

## 2. Imagens

- **Foto de perfil:** `foto-perfil.png`, feita no GPT (prompt abaixo). O recorte do título da capa do
  ebook foi reprovado pelo Gustavo em 2026-11-02 ("horrível"): a foto precisa ser desenhada para o
  círculo, não recortada de outra peça.
- **Capa:** `capa-facebook.png` (1640x624), feita a partir de uma arte do GPT (prompt abaixo).

A capa sai do `capa-gpt.png` com `node montar-imagens.mjs` (de dentro desta pasta), recortada na faixa
do meio. Se o recorte cortar o título, rode com um deslocamento em % (ex.: `node montar-imagens.mjs -5`
sobe a faixa, `5` desce).

### Prompt da foto de perfil (GPT)

Abra uma conversa nova no GPT e anexe `../Mockup do eBook Natal Mágico.png`. Salve o resultado aqui
como `foto-perfil.png`.

```
Crie a foto de perfil da página do Facebook do ebook "Natal Mágico", no mesmo estilo da capa do livro da imagem anexada: o mesmo Papai Noel fofo (olhinhos fechados sorrindo, bochechas rosadas, barba branca fofinha), as mesmas letras do título e as mesmas cores.

O desenho: fundo verde-escuro de noite de Natal preenchendo a imagem inteira, até os cantos, com flocos de neve e estrelinhas douradas pequenas. No centro, o Papai Noel grande, do peito para cima, acenando com uma mão. Um pouco abaixo do meio, passando na frente do peito dele, a faixa vermelha com o título "Natal Mágico" escrito igual ao da capa: "Natal" em creme e "Mágico" em dourado, com um raminho de azevinho na ponta da faixa.

Regras:
- Imagem quadrada (1:1). O Facebook mostra a foto em círculo: o Papai Noel e a faixa ficam dentro de um círculo no centro, com folga, e nos cantos só o fundo.
- O único texto é "Natal Mágico". Sem "Ebook", sem subtítulo e sem preço.
- Formas grandes e contorno bem marcado, para reconhecer mesmo com a foto pequena.
- Sem moldura e sem fundo branco.
```

Se o título sair torto ou com letra errada, peça: "Corrija só o texto da faixa para "Natal Mágico",
sem mudar mais nada". Depois o Claude confere como fica no círculo, no tamanho da página e no do
anúncio.

### Prompt da capa (GPT)

Abra uma conversa nova no GPT e anexe, nesta ordem:
1. `fotos/anuncio-01-so-imprimir.png` (estilo)
2. `../Mockup do eBook Natal Mágico.png` (capa do ebook)
3. `../Páginas Natalinas para Colorir em Madeira.png` (desenhos)
4. `../Artesanato natalino para colorir na mesa.png` (moldes)

Salve o resultado aqui como `capa-gpt.png`.

```
Crie a capa de uma página do Facebook no mesmo estilo da primeira imagem anexada: mesma luz quente de Natal, mesmo fundo com árvore e pisca-pisca desfocados, mesma mesa de madeira e mesmas letras grossas e arredondadas em verde-escuro e vermelho.

Formato: horizontal largo, 16:9.

A cena, sobre a mesa de madeira: um pouco à esquerda do centro, o ebook "Natal Mágico" em pé, exatamente com a capa da segunda imagem anexada. À direita do ebook, o título. Espalhadas pela mesa, nos dois lados, folhas impressas de desenhos de Natal para colorir iguais aos da terceira imagem anexada e folhas de moldes com linha pontilhada de recorte iguais às da quarta, algumas já pintadas, com lápis de cor, giz de cera e uma tesoura sem ponta.

Textos, escritos exatamente assim, e mais nenhum outro texto na imagem (fora o que já está na capa e nas folhas):
- Título em 2 linhas: "Atividades de Natal" (verde-escuro) e "prontas pra imprimir" (vermelho)
- Logo abaixo do título, numa faixa clara com borda pontilhada dourada: "15 desenhos + 20 moldes + 10 atividades"

Regras:
- O Facebook corta as bordas da imagem: o ebook e todos os textos ficam no miolo. O quinto de cima, o quinto de baixo e o sexto de cada lateral ficam só com o fundo, a mesa e as folhas, sem texto e sem o ebook.
- Sem preço, sem selo e sem a palavra "grátis".
- Sem pessoas, sem mãos e sem rostos.
- Sem estrelas de avaliação.
```

Confira cada letra antes de aceitar. Se errar, peça: "Corrija só o texto X, sem mudar mais nada".

---

## 3. Primeiros posts

Publicar os 5 no dia em que criar a página e **fixar o 1º no topo**. Só o 1º leva o link: o botão
da página já leva ao site. Sem depoimento, sem "de/por" e sem prometer o que a criança vai aprender
(mesmas regras dos anúncios, seção 5 do `estrutura.md`).

### Post 1 (fixado): o que é o Natal Mágico

Imagem: `../Mockup do eBook Natal Mágico.png`

```
🎄 Boas-vindas ao Natal Mágico!

É um kit de Natal em PDF pra imprimir em casa e fazer junto com as crianças:
✅ 15 desenhos para colorir
✅ 20 moldes natalinos para recortar e decorar
✅ 10 atividades: caça-palavras, labirinto, jogo da memória, bingo, cartinha para o Papai Noel e mais

São 45 recursos num arquivo só. Chega no seu e-mail logo depois da compra, e você imprime quantas vezes quiser.

👉 R$ 19,90, pagamento único: https://natal-magico-gamma.vercel.app
```

### Post 2: os desenhos

Imagem: `../Páginas Natalinas para Colorir em Madeira.png`

```
🖍️ Os 15 desenhos do Natal Mágico vêm um por folha A4: Papai Noel no trenó, rena, boneco de neve, pinguim, duende, casa de gengibre, árvore cheia de presentes, ursinho, gatinho na meia, coruja na neve e mais.

O contorno é bem marcado, pra pintar com lápis de cor, giz de cera ou canetinha.

Qual vocês pintariam primeiro? 👇
```

### Post 3: os moldes

Imagem: `../Artesanato natalino para colorir na mesa.png`

```
✂️ São 20 moldes natalinos pra colorir, recortar e usar como quiser: enfeite da árvore, cartão, mural ou embrulho de presente.

Cada molde já vem com a linha pontilhada de recorte. É imprimir, pintar e recortar.

Estão no Natal Mágico, junto com os 15 desenhos e as 10 atividades. 🎄
```

### Post 4: as atividades

Imagem: `../atividades/Atividades Natalinas na Mesa de Madeira.png`

```
🧩 As 10 atividades do Natal Mágico:

1. Caça-palavras de Natal
2. Labirinto
3. Ligue cada desenho à sua sombra
4. Conte os enfeites
5. Sudoku de figuras pra recortar
6. Jogo da memória com 12 pares
7. Bingo de Natal com 4 cartelas
8. Cartinha para o Papai Noel
9. Decore a árvore, com 20 enfeites pra recortar e colar
10. Complete o desenho

Acabou? É só imprimir de novo. 🖨️
```

### Post 5: os extras do checkout

Imagens: `../thumb-bump-caixinhas.png` e `../thumb-bump-papai-noel.png` (as duas no mesmo post)

```
🎁 Na hora da compra, dá pra levar junto dois extras:

📦 Caixinhas de Natal para presentear (R$ 4,90): 4 caixinhas de bombom pra imprimir e montar, com Papai Noel, rena, boneco de neve e árvore, e 3 tags de cada.

🎅 Kit "Papai Noel passou aqui" (R$ 5,80): carta do Papai Noel, certificado, placa pra porta, bilhetes de agradecimento, etiquetas "Do Papai Noel" e molde da bota pra fazer a magia na noite de Natal.

Os dois são opcionais: o Natal Mágico sai por R$ 19,90 sozinho.
```

Se houver garantia de 7 dias confirmada na Wiapy (item 1 da seção 6 do `estrutura.md`), dá para pôr
"Garantia de 7 dias." no fim do post 1.

---

## 4. Passo a passo (Gustavo, no computador)

1. Facebook → menu → **Páginas** → **Criar nova Página** (ou `facebook.com/pages/create`).
2. Nome, categoria e bio da seção 1 → **Criar Página**.
3. Site e e-mail. Telefone, endereço e horário ficam em branco: pode pular.
4. Foto de perfil (`foto-perfil.png`) e capa (`capa-facebook.png`).
5. Pular "Convidar amigos" e "Conectar o WhatsApp" (não precisa).
6. Embaixo da capa: **Adicionar botão** → Comprar agora (ou Saiba mais) → link do site.
7. Nome de usuário: nas configurações da Página, procurar "Nome de usuário".
8. Publicar os 5 posts da seção 3 e fixar o 1º (três pontinhos do post → **Fixar publicação**).
9. Na hora de criar o anúncio, em **Identidade**, escolher a Página **Natal Mágico**. Se ela não
   aparecer: Configurações do portfólio empresarial → Contas → Páginas → Adicionar. No Instagram,
   sem conta própria, escolher "Usar a Página do Facebook".
