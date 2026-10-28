# Pesquisa de anúncios em alta — beleza para mulheres de 20 a 40 anos

Feita em 2026-10-18 na Biblioteca de Anúncios da Meta (Brasil, só anúncios
ativos, ordenados por impressões, ou seja, os de maior alcance aparecem
primeiro). Foram 19 buscas e cerca de 500 anúncios vistos.

Objetivo: escolher um produto digital de beleza pra vender na Kiwify.

## Como ler os sinais

A Biblioteca não mostra vendas nem quanto cada anúncio gastou. Os sinais
usados são estes:

- **Dias no ar:** anúncio que dá prejuízo é desligado. Se está no ar há
  mais de 60 dias, provavelmente dá lucro.
- **Cópias do mesmo criativo** ("N anúncios usam esse criativo e esse
  texto"): o anunciante duplica o que funciona pra escalar. É o sinal mais
  forte.
- **Posição na busca por impressões:** quanto mais no topo, mais gente viu.

## Ferramenta usada

Repositório `devdk/Openangle-Meta-ads-competitor-analysis` (do tópico
github.com/topics/metaads). Limitações encontradas:

- A busca dele usa a API da Meta, que só devolve anúncios comerciais
  veiculados na União Europeia. Pro Brasil ela volta vazia. Por isso os
  anúncios foram coletados direto no site da Biblioteca e passados ao repo
  pelo modo `--mock`.
- As regras de oferta, CTA e "mapa de ângulos" dele são escritas em inglês
  e não reconhecem texto em português. Ele marcou todos os 10 ângulos como
  "abertos", mas isso é falso. Só o **ranking de ganchos por repetição**
  vale (tabela abaixo).

## Ranking de ganchos (saída do repo, 31 criativos, 90 anúncios)

| # | Gancho | Cópias | Anunciante | Plataforma |
|---|---|---|---|---|
| 1 | "A lista com os melhores fornecedores de maquiagem para loja de 10!" | 24 | Olhos que Encantam | Kiwify |
| 2 | "Os Segredos da Maquiagem Sofisticada por apenas R$ 47." | 11 | Juliana Celeiro MakeUp | site próprio |
| 3 | "+100 Mapas Mentais Ilustrados para Saúde Capilar." (R$ 17,90) | 6 | Mapas Capilares | site próprio |
| 4 | "Lista de Fornecedores de Acessórios pra montar sua loja de R$ 10" (R$ 9,99) | 5 | Lista de Fornecedores de Maquiagem | Kiwify |
| 5 | "Você já fez sua análise de coloração pessoal, mas ainda erra na maquiagem?" | 5 | Onna ateliê (ebook) | — |
| 6 | "Mais de 50 ativos de skincare com resultado comprovado." | 3 | Escola da Pele (guia) | site próprio |
| 7 | "Quer entregar o loiro perfeito e se tornar referência em loiros no seu salão?" (de 97 por 67) | 3 | Débora Zago Hair (ebook) | site próprio |
| 8 | "Aprenda a se maquiar sem depender de ninguém." | 2 | Camila Barreto | site próprio |

## Anúncios que estão há mais tempo no ar

| Produto | Dias no ar | Público | Plataforma |
|---|---|---|---|
| E-book "Pele Saudável – o segredo da pele perfeita" (14 capítulos) | 1.190 | consumidora | Kiwify (link morto em 2026-10-18, ver nota abaixo) |
| "Guia dos Cabelos Brancos" (pede pra comentar "branco") | 514 | consumidora 35+ | Instagram/DM |
| Camuflagem de fios brancos sem química | 479 | consumidora 35+ | DM |
| "Domine Seu Melasma" | 383 | consumidora | Instagram |
| Aula + e-book: flacidez e queda de cabelo com Mounjaro | 179 | consumidora | site próprio |
| E-book "Loira dos Sonhos" | 171 | cabeleireira | site próprio |
| Método Molde F1 (unhas) | 156 | manicure | Kiwify |
| "Mapa dos Peelings" | 151 | esteticista | site próprio |
| Curso de AutoMake online (usa o nome da Virgínia) | 130 | consumidora | site próprio |

Fora dos infoprodutos, quem domina skincare são marcas físicas: Principia
(dezenas de anúncios com influenciadores) e Cicatribem (clareador, 21 cards
iguais no topo, 226 dias). As dores que elas exploram mostram o que a
mulher de 20 a 40 procura: **manchas e clareamento, pele oleosa,
antissinais "depois dos 30", protetor com cor e rotina simples**.

## Os 3 caminhos com demanda comprovada

### 1. Skincare descomplicado (consumidora final)

- **Prova:** o "Guia de Ativos de Skincare" é novo e já tem 3 cópias
  (mas é vendido só pra profissionais, a R$ 49). Na Hotmart há vários guias
  pra consumidora de R$ 39,90 a R$ 49,90. O e-book "Pele Saudável" está no
  ar há 1.190 dias, mas o link dele está morto (ver nota abaixo).
- **Dor:** "Cansada de gastar com cremes que não funcionam?", "Seu skincare
  não precisa ser complicado", "qual ativo usar e em que ordem".
- **Encaixe com o Gustavo:** é texto com fonte (dermatologia, SBD, artigos),
  igual ao método do ebook de frutíferas. Não precisa aparecer como
  especialista.
- **Risco:** médio. Não pode prometer tratar melasma ou acne.

### 2. Automaquiagem e coloração pessoal (consumidora final)

- **Prova:** curso de R$ 47 com 11 cópias e 89 dias no ar. Dezenas de aulas
  presenciais de automaquiagem anunciadas em várias cidades (80 a 350 dias
  no ar). O ebook de coloração + maquiagem tem 5 cópias. O próprio ChatGPT
  anuncia "descubra sua paleta de cores", sinal de tendência.
- **Dor:** "sei comprar maquiagem mas não sei usar", "batom me apaga, base
  me deixa acinzentada".
- **Risco de anúncio:** baixo (maquiagem não é promessa de saúde).
- **Ponto fraco:** é muito visual. Concorre com vídeo e pede autoridade de
  maquiadora.

### 3. Renda extra com beleza (lista de fornecedores)

- **Prova:** o sinal mais forte da pesquisa (24 cópias do mesmo criativo,
  na Kiwify). Já tem clones a R$ 9,99.
- **Ponto fraco:** não é cuidado de beleza, é negócio. Exige uma lista real
  e conferida de fornecedores e está saturando rápido.

## Recomendação

Caminho 1, **skincare descomplicado**: um guia de rotina por tipo de pele e
de ativos, com o ângulo "pare de gastar com produto errado". O melhor guia
de ativos do mercado é só pra profissionais, e a versão pra consumidora
não tem dono. O conteúdo pode ser conferido em fonte confiável, que é a
regra dos ebooks do Gustavo. Fica na faixa de preço do mercado.
Escolhido em 2026-10-18; a estrutura está em `estrutura.md`.

**Nota (2026-10-18):** o link do e-book "Pele Saudável" (`kiwify.app/C6ETTZM`)
dá `LINK_NOT_FOUND`. O anúncio de 1.190 dias provavelmente está
abandonado, então não conta como prova de venda.

Como bônus, um capítulo de "maquiagem que conversa com a sua pele" puxa a
demanda do caminho 2 sem depender de vídeo.

## Padrões que se repetem nos anúncios que escalam

- **Preço no gancho:** "por apenas R$ 47", "de R$ 97 por R$ 19,90", "DE 97
  POR 67".
- **Faixa de preço:** de R$ 9,90 a R$ 47. A maioria fica entre R$ 17 e
  R$ 20.
- **Segredo revelado:** "Revelei os fornecedores...", "Os Segredos da...".
- **Pergunta com dor bem específica:** "Batom te apagando? Blush pesado?
  Base que te deixa acinzentada?"
- **Virada da culpa:** "Você já tentou shampoo, tônico, vitamina,
  sérum... e se o problema nunca tivesse sido o produto?"
- **Cenário desejado:** "E se você pudesse fazer aquela maquiagem linda,
  sozinha, sempre que quisesse?"
- **Prova social no título do link:** "4,9/5 | +730 alunas já começaram".
- **Comente pra receber:** "Comente MELASMA e receba o e-book" (leva a
  conversa pro direct).

## Cuidados com a política de anúncios da Meta

- Não afirmar característica pessoal ou condição de saúde da pessoa ("Você
  tem manchas?", "Sua pele está velha"). Falar do tema, não da pessoa.
- Evitar foto de antes e depois e promessa de cura (melasma, acne, queda de
  cabelo).
- Não usar nome de famosa sem autorização (ex.: "A Virgínia indicou").
- Mounjaro e emagrecimento: categoria restrita. Melhor ficar de fora.

## Buscas feitas

skincare, acesso imediato pele, ebook cabelo, manchas no rosto, cronograma
capilar, kiwify, kiwify pele, kiwify cabelo, kiwify maquiagem, acesso
imediato cabelo, acesso imediato maquiagem, ebook skincare, depois dos 30
pele, automaquiagem, coloração pessoal, yoga facial, unhas em casa, guia
skincare, hotmart pele.

Dica: a busca "kiwify + palavra" casa com o link `pay.kiwify.com.br` e
mostra só o que é vendido na Kiwify.
