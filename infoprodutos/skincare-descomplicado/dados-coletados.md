# Dados coletados — anúncios de beleza na Biblioteca da Meta

Base da `pesquisa-anuncios-meta.md` e da `estrutura.md`.

## Como foi coletado

- **Fonte:** [Biblioteca de Anúncios da Meta](https://www.facebook.com/ads/library/),
  Brasil, só anúncios ativos, ordenados por impressões (maior alcance
  primeiro).
- **Quando:** 1ª coleta em 2026-10-18. Reconferida em 2026-10-19 pra pegar o
  link de cada anúncio. Por isso os dias estão +1 e algumas cópias mudaram
  (ex.: "Olhos que Encantam" foi de 24 pra 31 cópias).
- **O que foi anotado de cada anúncio:** data de início (virou "dias no ar"),
  quantos anúncios usam o mesmo criativo ("cópias"), anunciante, texto,
  domínio do link e botão.
- **Volume:** 19 buscas. Na 1ª coleta, cerca de 500 anúncios vistos (até 40
  por busca). Abaixo estão os 20 primeiros de cada busca, já sem repetidos.
- **Repositório usado:** [devdk/Openangle-Meta-ads-competitor-analysis](https://github.com/devdk/Openangle-Meta-ads-competitor-analysis)
  (do tópico [github.com/topics/metaads](https://github.com/topics/metaads)).
  Ranking de ganchos dele em `dados/hooks.csv`; os 31 criativos que entraram
  na análise estão em `dados/anuncios-analisados.json`.

**Como ler:** "Dias no ar" alto quer dizer que o anúncio provavelmente dá
lucro. "Cópias" alto quer dizer que o anunciante está escalando. Clique em
**ver** pra abrir o anúncio (com imagem ou vídeo) na Biblioteca.

---

## Anúncios-chave (os que sustentam a análise)

| Produto / gancho | Dias no ar | Cópias | Anunciante | Link do anúncio | Página de venda |
|---|---|---|---|---|---|
| Lista de fornecedores de maquiagem "pra loja de 10" | 59 | 31 | Olhos que Encantam | [ver](https://www.facebook.com/ads/library/?id=1788022475545838) | Kiwify |
| "Revelei os fornecedores das maiores redes de lojas de maquiagem" | 29 | 2 | Olhos que Encantam | [ver](https://www.facebook.com/ads/library/?id=1137386761964279) | Kiwify |
| "Os Fornecedores que são a fonte das lojas de 10!" | 30 | — | Olhos que Encantam | [ver](https://www.facebook.com/ads/library/?id=2185870822307288) | Kiwify |
| "Resolvi ensinar o segredo que me fez mudar de patamar vendendo maquiagem" | 30 | 2 | Olhos que Encantam | [ver](https://www.facebook.com/ads/library/?id=1391021195916132) | Kiwify |
| Lista de fornecedores de acessórios (R$ 9,99) | 33 | 4 | Lista de Fornecedores de Maquiagem | [ver](https://www.facebook.com/ads/library/?id=1056275400516777) | [meufornecedorapp.lovable.app](https://meufornecedorapp.lovable.app) |
| Os Segredos da Maquiagem Sofisticada (R$ 47) | 90 | 10 | Juliana Celeiro MakeUp | [ver](https://www.facebook.com/ads/library/?id=1769498110902656) | [maquiagemsofisticada.julianaceleiro.com.br](https://maquiagemsofisticada.julianaceleiro.com.br) |
| Descubra o Poder da Automaquiagem (versão 1) | 11 | — | Juliane Schiavini | [ver](https://www.facebook.com/ads/library/?id=1130731806490541) | Kiwify |
| Descubra o Poder da Automaquiagem (versão 2) | 11 | — | Juliane Schiavini | [ver](https://www.facebook.com/ads/library/?id=4512872365647952) | Kiwify |
| Curso completo de automaquiagem | 9 | 2 | Camila Barreto | [ver](https://www.facebook.com/ads/library/?id=948409387881229) | [camilabarreto.online](https://camilabarreto.online) |
| Curso de AutoMake (usa o nome da Virgínia) | 131 | — | Niki Miguel | [ver](https://www.facebook.com/ads/library/?id=974835422129004) | [v0-make-makeup-course.vercel.app](https://v0-make-makeup-course.vercel.app) |
| eBook coloração pessoal + maquiagem | 37 | 3 | Onna ateliê | [ver](https://www.facebook.com/ads/library/?id=1659000062509791) | — |
| Programa Pele Madura (maquiagem 40+) | 3 | — | ludmarianomakeup | [buscar](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=%22Programa%20Pele%20Madura%22&search_type=keyword_exact_phrase) | [pelemaduracurso.lovable.app](https://pelemaduracurso.lovable.app) |
| Guia de Ativos de Skincare (R$ 49, só profissional) | 24 | 5 | Escola da Pele | [ver](https://www.facebook.com/ads/library/?id=1843575960134612) | [pg.escoladapele.com.br/guia-ativos-v3sb](https://pg.escoladapele.com.br/guia-ativos-v3sb/) |
| E-book "Pele Saudável" (link morto) | 1.191 | — | Starbam - Store | [ver](https://www.facebook.com/ads/library/?id=656578753021932) | [kiwify.app/C6ETTZM](https://kiwify.app/C6ETTZM) (dá `LINK_NOT_FOUND`) |
| Guia dos Cabelos Brancos | 515 | — | Portal APS | [ver](https://www.facebook.com/ads/library/?id=676898635116678) | Instagram/DM |
| Camuflagem de fios brancos | 480 | 3 | Zazá Martins | [ver](https://www.facebook.com/ads/library/?id=1242701237264225) | DM |
| "Domine Seu Melasma" | 384 | — | Domine Seu Melasma | [ver](https://www.facebook.com/ads/library/?id=1513313669852034) | Instagram |
| E-book de melasma (comente MELASMA) | 34 | — | Dra Karinne Vargas | [ver](https://www.facebook.com/ads/library/?id=1343500427632033) | WhatsApp |
| Aula + e-book: Mounjaro, flacidez e queda de cabelo | 180 | — | Jessica Lima Nutri | [ver](https://www.facebook.com/ads/library/?id=4454212961482308) | [nutrijessicalima.lovable.app](https://nutrijessicalima.lovable.app) |
| "Queda de cabelo é sintoma, não diagnóstico" (gratuito) | 102 | — | Jaqueline Rodrigues | [ver](https://www.facebook.com/ads/library/?id=1398711748830834) | — |
| "Depois dos 30, a pele para de se regenerar" (GHK-Cu) | 3 | — | Jheny Santucci | [ver](https://www.facebook.com/ads/library/?id=2218834659043555) | [lp.revitaderma.com.br](https://lp.revitaderma.com.br) |
| Protocolo "seu cabelo tá pedindo socorro" (novo na 2ª coleta) | 63 | 10 | Beleza com Saúde | [ver](https://www.facebook.com/ads/library/?id=1810013990433124) | — |
| Método Derma Glow, clareamento de axilas (R$ 9,90) | 29 | 2 | Juliana Fonseca | [ver](https://www.facebook.com/ads/library/?id=1403154704736223) | [foifeitopravc.online](https://foifeitopravc.online) |
| Limpeza de Pele do Zero (de R$ 97 por R$ 19,90) | 35 | — | Dra. Beatriz H. Biomedicina | [ver](https://www.facebook.com/ads/library/?id=2309728506233160) | Hotmart |
| Curso de maquiagem por R$ 5,90 | 19 | 2 | Marina Costa Make | [ver](https://www.facebook.com/ads/library/?id=1653402263164159) | — |
| Sobrancelha (mapeamento e henna) | 14 | 2 | Natasha Silva Sobrancelhas | [ver](https://www.facebook.com/ads/library/?id=2049197152467415) | Kiwify |
| Método Molde F1 (unhas) | 157 | 2 | Michaelle Almeida Nails | [ver](https://www.facebook.com/ads/library/?id=1321564646611189) | Kiwify |
| Curso de escova por R$ 17 | 107 | 3 | Fabiana Steffens | [ver](https://www.facebook.com/ads/library/?id=2043523136567875) | [split.vkdigital.com.br](https://split.vkdigital.com.br) |
| 4 cursos + 4 certificados por R$ 17 | — | — | Ludmila Rodrigues Offcial | [buscar](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=%224%20CURSOS%20%2B%204%20CERTIFICADOS%22&search_type=keyword_exact_phrase) | [ludmilarodrigues.com.br](https://ludmilarodrigues.com.br) |
| +100 Mapas Mentais de Saúde Capilar (R$ 17,90) | 37 | 5 | Mapas Capilares | [ver](https://www.facebook.com/ads/library/?id=1401442345418337) | [mapamentalcapilar.com.br](https://www.mapamentalcapilar.com.br) |
| Mapa dos Peelings | 152 | — | Graziela Dias Esteta | [ver](https://www.facebook.com/ads/library/?id=868976152886844) | [grazidias.com.br](https://grazidias.com.br) |
| E-book Loira dos Sonhos (de 97 por 67) | 172 | 3 | Débora Zago Hair | [ver](https://www.facebook.com/ads/library/?id=2003722107189445) | [deborazagohair.com.br](https://deborazagohair.com.br) |
| E-book de cicatrizes de acne (pra profissional) | — | — | Caroline Grillette Estética | [buscar](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=%22cicatrizes%20de%20acne%22&search_type=keyword_exact_phrase) | Kiwify |
| Clareador dérmico (marca física, maior escala de skincare) | 227 | 15 | Cicatribem | [ver](https://www.facebook.com/ads/library/?id=1442690403982156) | [cicatribem.com.br](https://cicatribem.com.br) |
| "Clareie sua pele enquanto dorme" (marca física) | 147 | 11 | Cicatribem | [ver](https://www.facebook.com/ads/library/?id=2146087419506014) | [cicatribem.com.br](https://cicatribem.com.br) |
| Rotinas de skincare personalizadas (marca física) | 110 | 6 | Principia Skincare Pro | [ver](https://www.facebook.com/ads/library/?id=990789080602820) | [principiaskin.com](https://www.principiaskin.com) |

"buscar" abre uma busca pelo texto do anúncio: esses 3 não apareceram entre
os 20 primeiros na reconferência.

---

## Concorrentes de skincare pra consumidora

- [Escola da Pele — Guia de Ativos](https://pg.escoladapele.com.br/guia-ativos-v3sb/): R$ 49, 75 páginas, só pra profissionais
- [Hotmart — busca "skincare"](https://hotmart.com/pt-br/marketplace/produtos?q=skincare): A Fórmula do Skincare (R$ 49,90), Guia do Skincare (R$ 49,90), Guia Prático para o SkinCare da Pele Madura 35+ (R$ 39,90), série Skincare Total por queixa (R$ 49,90 cada), cursos de R$ 197 a R$ 249
- [Starbam — Pele Saudável](https://kiwify.app/C6ETTZM): link morto

---

## Todas as buscas (20 primeiros resultados de cada, 2026-10-19)

Colunas: dias no ar, cópias, anunciante, começo do texto, domínio do link,
anúncio.

### 1. skincare (~20.000 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=skincare&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 119 |  | Laura Dubugras com Principia Skincare Pr | Vem passar um dia comigo na CA, com direito à visita de uma casa que estamos pensando em c | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1014121824338581) |
| 180 | 2 | TikTok - EU | Riapri TikTok oggi | tiktok.com | [ver](https://www.facebook.com/ads/library/?id=978481707850213) |
| 111 |  | IsabelaMac com Principia Skincare Pro | Quero saber quais outras dicas de inverno vocês tem para compartilhar 💖 . . #fy #explore  | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1226344597223963) |
| 48 |  | IsabelaMac com Principia Skincare Pro | Uma rotina de skincare é algo que simplesmente faz bem para além da pele💖 aqui eu estou u | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1874221163546057) |
| 49 |  | Alibaba.com | Enjoy great profits on global product sourcing and choose from one of the world's leading  | m.alibaba.com | [ver](https://www.facebook.com/ads/library/?id=1549488932906628) |
| 110 | 6 | Principia Skincare Pro | Descubra rotinas de skincare personalizadas para as características da sua pele. Aproveite | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=990789080602820) |
| 178 |  | Principia Skincare Pro | O KIT ANTI-MANCHAS AVANÇADO da Principia tem alta eficácia em suavizar e uniformizar a pig |  | [ver](https://www.facebook.com/ads/library/?id=1651249216123039) |
| 179 |  | Amandaapoxa com Principia Skincare Pro | Testei o MAIOR lançamento do ano! 😍 o novo protetor solar com cor da Principia com FPS 70 | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=2680270175687334) |
| 40 | 2 | Mantecorp Skincare | Conheça a linha Episol Color: base, stick e pó compacto com alta proteção solar, cobertura |  | [ver](https://www.facebook.com/ads/library/?id=1098559262558062) |
| 140 |  | Jardel Edebran com Principia Skincare Pr | GUIA 2026 de @principiaskincare pra vocês! CUPOM: JARDEL Já comenta qual seu produto favor | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1318705503167712) |
| 178 |  | Dr. Rodrigo Andrade com Principia Skinca | 🐻 O SEGREDO PARA TRIPLICAR OS RESULTADOS DO SEU SKINCARE! 😱 Carinhosa, usar um produto s | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1285222509770580) |
| 376 |  | Sheryl Davis | Our Beauty Balm delivers sheer-to-light coverage with powerful skincare benefits. Hydrate, | covebalm.com | [ver](https://www.facebook.com/ads/library/?id=1172337828283311) |
| 17 | 3 | Mantecorp Skincare | Chegou o novo refil de Glycare Control Gel de Limpeza 240g da Mantecorp Skincare! Reduza a |  | [ver](https://www.facebook.com/ads/library/?id=28143160035380429) |
| 152 |  | Principia Skincare Pro | O KIT TRIO ANTISSINAIS da Principia tem alta eficácia aumentar a firmeza, elasticidade, hi |  | [ver](https://www.facebook.com/ads/library/?id=1328069949273679) |
| 40 |  | Mantecorp Skincare | Pele oleosa também precisa de cuidado, hidratação e proteção. ✨ | www.mantecorpskincare.com.br | [ver](https://www.facebook.com/ads/library/?id=2876287086087672) |
| 81 | 3 | Principia Skincare Pro | Protetor Solar com cor da Principia😍 com FPS 70, ele possui cobertura de base, além de se |  | [ver](https://www.facebook.com/ads/library/?id=1791001148559320) |
| 178 |  | Principia Skincare Pro | Kit Antiqueda Trio da Principia 😍 ajuda a reduzir a quebra, acelerar o crescimento e aume | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1465358558401775) |
| 140 |  | Principia Skincare Pro | A Principia tem séruns com alta performance dermatológica 😍 e são recomendados por dermat |  | [ver](https://www.facebook.com/ads/library/?id=1684151172914529) |
| 179 |  | raoniiiarin com Principia Skincare Pro | Minha pele nunca esteve tão equilibrada ✨ Esse é o kit essencial da @principiaskincare que | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=2188765955281381) |
| 46 |  | Laura Dubugras com Principia Skincare Pr | VLOG MERGULHANDO COM AS BALEIAS NO MEIO DO PACÍFICO #publi #publicidade | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=28373230575647317) |

### 2. acesso imediato pele (~700 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=acesso%20imediato%20pele&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 147 | 3 | Drama Explosivo Brasil | ?Ainda baixou animado por propagandas de "grátis", só para descobrir que precisa pagar par | play.google.com | [ver](https://www.facebook.com/ads/library/?id=924359727311812) |
| 54 |  | Biomedicina Estética | Aprenda uma das técnicas mais procuradas da estética e dê o próximo passo na sua carreira. |  | [ver](https://www.facebook.com/ads/library/?id=1035048649153838) |
| 46 | 2 | Mariana Torres | Se você ainda usa o Claude pra reescrever parágrafo... o problema não é você. É que te ens |  | [ver](https://www.facebook.com/ads/library/?id=2167789070469528) |
| 124 | 2 | Anna Pegova HOF | Atenção, profissionais de Harmonização Facial! Desbloqueie o potencial dos seus procedimen |  | [ver](https://www.facebook.com/ads/library/?id=2166983050749744) |
| 92 |  | Dr. Claudio Farcic | A Luana Piovani fez uma blefaroplastia, falou disso abertamente, e o detalhe mais importan | claudiofarcic.com.br | [ver](https://www.facebook.com/ads/library/?id=880346784699089) |
| 54 | 2 | Biomedicina Estética | ✨ Pele hidratada, viçosa e iluminada… é exatamente isso que as clientes estão procurando — |  | [ver](https://www.facebook.com/ads/library/?id=1681282786269983) |
| 152 |  | Graziela Dias Esteta e Cosmetóloga | 🌟 Mapa dos Peelings: Introdução Clínica e Fundamentos Você não precisa de anos de experiê | grazidias.com.br | [ver](https://www.facebook.com/ads/library/?id=868976152886844) |
| 81 | 5 | Fabiola ISB | 📚 Cansado de revisar conteúdos enormes e sentir que nada fixa? Com o ENAMED 2026 — 120 Ma | 120.mapavisual.online | [ver](https://www.facebook.com/ads/library/?id=3274098462792070) |
| 143 | 2 | Alex Herbich | Método completo com todas as etapas para fabricar esquadrias de alumínio | cursosdz.com | [ver](https://www.facebook.com/ads/library/?id=2512078732564448) |
| 29 | 2 | Juliana Fonseca | ✨ Dê o primeiro passo na estética aprendendo clareamento de axilas e virilhas! Com o Métod | foifeitopravc.online | [ver](https://www.facebook.com/ads/library/?id=1403154704736223) |
| 69 |  | Academy Class Brasil | 🌟 Você sabia que o procedimento de Clareamento de lntimo é a sensação do momento? A deman | institutobeautyacademy.com.br | [ver](https://www.facebook.com/ads/library/?id=2269830577164139) |
| 26 |  | Biomedicina Estética | Torne-se a especialista que todo mundo procura em um dos procedimentos que mais crescem na |  | [ver](https://www.facebook.com/ads/library/?id=3108237739346481) |
| 53 |  | Biomedicina Estética | Você sabe indicar o bioestimulador certo pra cada tipo de pele e resultado? A maioria dos  |  | [ver](https://www.facebook.com/ads/library/?id=1790730988841133) |
| 33 |  | Conhecimento Visual | Você, Médico Veterinário e Estudante de Medicina Veterinária, estuda, estuda, estuda e ain | clinicacaesegatos.conhecimentovisual.online | [ver](https://www.facebook.com/ads/library/?id=1054624034052277) |
| 3 |  | Jheny Santucci | Depois dos 30, a pele não para de envelhecer. Ela para de se regenerar. Existe uma molécul | lp.revitaderma.com.br | [ver](https://www.facebook.com/ads/library/?id=2218834659043555) |
| 42 | 2 | Joana Gersiara | 🧵 KIT DE MOLDES DE CALCINHAS COSTURADAS APENAS NA OVERLOCK E DOMÉSTICA +20 moldes profiss | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=907300965458252) |
| 192 |  | Dra. Marcella Pinheiro com Clínica Marce | Liberdade é não ter que se preocupar com o despertador todos os dias! 🕒✨ O Implanon NXT é | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1314271743894332) |
| 26 |  | Biomedicina Estética | Veja a diferença que o bioestimulador de colágeno faz: pele mais firme, definida e com viç |  | [ver](https://www.facebook.com/ads/library/?id=1819380029413932) |
| 26 |  | Biomedicina Estética | Domine o Jato de Plasma do iniciante ao avançado! ✨ Aprenda uma técnica da estética avança |  | [ver](https://www.facebook.com/ads/library/?id=1389633323280838) |
| 74 |  | Aline Oliveira | Mais de 500 prompts femininos prontos para copiar com apenas 1 clique. Crie ensaios fotogr | alinestudio.com.br | [ver](https://www.facebook.com/ads/library/?id=1574216737388925) |

### 3. ebook cabelo (~220 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=ebook%20cabelo&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 90 |  | Julio Luchmann. - Página | Essa oferta não vai durar para sempre… Adquira agora o livro Farmácia Viva, com tudo o que | julioluchmann.com.br | [ver](https://www.facebook.com/ads/library/?id=1014291824832176) |
| 172 | 3 | Débora Zago Hair | ✨ Quer entregar o loiro perfeito e se tornar referência em loiros no seu salão? Com o E-bo | deborazagohair.com.br | [ver](https://www.facebook.com/ads/library/?id=2003722107189445) |
| 52 | 16 | Julio. Luchmann. | Você ainda acha que precisa correr pra farmácia a cada sintoma? Com o livro Farmácia Viva, | julioluchmann.com.br | [ver](https://www.facebook.com/ads/library/?id=2146086502998309) |
| 515 |  | Portal APS | Comente "branco" e tenha acesso a melhor condição do Guia dos Cabelos Brancos. #cabelosbra | instagram.com | [ver](https://www.facebook.com/ads/library/?id=676898635116678) |
| 99 |  | Géssica Andrade | Quais desses exames você já fez? Me conta❗️ 🎁 Quer aprender a desinflamar? Digite PRESENT | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1373436704722098) |
| 362 |  | Dra. Marcelly Achkar | Para maiores informações, o link do E-book está na Bio. | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1138285124948854) |
| 243 |  | Página "Ana Tripoloni" | ⬇️ Comente "LIVRE" aqui embaixo pra se inscrever na Imersão que vai te ensinar como se lib | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1617715382573437) |
| 90 | 2 | Julio Luchmann. - Página | Você ainda acha que precisa correr pra farmácia a cada sintoma? Com o livro Farmácia Viva, | julioluchmann.com.br | [ver](https://www.facebook.com/ads/library/?id=1808603530474663) |
| 87 |  | Afya Dermato | Queda de cabelo em paciente usando GLP-1, minoxidil oral ganhando espaço, inibidores de JA | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1602113781334498) |
| 61 |  | Côrte visagismo para homens | Quer alinhar a sua imagem a sua comunicação? Comente "POSICIONAMENTO" e receba um e-book e | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1622094422672434) |
| 90 | 2 | HairPro Academy | 🛑 Por que tem cabeleireiro na sua região cobrando 3x mais que você pelo mesmo serviço de  |  | [ver](https://www.facebook.com/ads/library/?id=1552692042580367) |
| 138 |  | m.amaroots | POTINHO MÁGICO ESPECIAL GRISALHAS!! ❤️ Criei um Potinho Mágico ideal para quem tem fios br | www.mamaroots.com.br | [ver](https://www.facebook.com/ads/library/?id=817429844572280) |
| 102 |  | Jaqueline Rodrigues | 100% GRATUITO Você já tentou shampoo, tônico, vitamina, sérum... Mas e se o problema nunca |  | [ver](https://www.facebook.com/ads/library/?id=1398711748830834) |
| 180 |  | Jessica Lima Nutri | Você começou a usar Mounjaro e está perdendo peso rápido. Ótimo.Mas ninguém te avisou do o | nutrijessicalima.lovable.app | [ver](https://www.facebook.com/ads/library/?id=4454212961482308) |
| 125 | 2 | Dra isabela souza de Paula | Você sente cansaço persistente, alterações de peso, queda de cabelo, ansiedade ou dificuld | draisabelasouza.com.br | [ver](https://www.facebook.com/ads/library/?id=933886173041238) |
| 102 |  | Maximus Tecidos Finos | ✍️ Aprenda Desenhar seus próprios Croquis de Moda de forma Profissional e seja Valorizado( | cursos.maximustecidos.com.br | [ver](https://www.facebook.com/ads/library/?id=1359209989467241) |
| 25 |  | Natumaxx | Dono de salão ou cabeleireiro: seus clientes podem ser uma nova fonte de receita.💰 Todos  | fb.me | [ver](https://www.facebook.com/ads/library/?id=1473397294849199) |
| 19 |  | Loja Aphrodite | 🤨 Teria coragem de cortar uma franja? E se eu te dissesse que você pode ter esse visual s | lojaaphrodite.com | [ver](https://www.facebook.com/ads/library/?id=1073316831973435) |
| 9 |  | Salão Jaime Alves | ⚠️ A apostila com as técnicas que você precisava. Tudo atualizado com cortes da atualidade | guiadageometria.lovable.app | [ver](https://www.facebook.com/ads/library/?id=2170809397193375) |
| 12 |  | Professora Jaqueline Santos | A banca de heteroidentificação não olha a sua certidão. Olha você. O critério é o fenótipo | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1778331123317968) |

### 4. manchas no rosto (50.000 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=manchas%20no%20rosto&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 227 | 15 | Cicatribem | ✨ Clarear a pele nunca foi tão simples (e eficaz)! ✨ O Clareador Dérmico Cicatribem atua e | cicatribem.com.br | [ver](https://www.facebook.com/ads/library/?id=1442690403982156) |
| 147 | 11 | Cicatribem | Clareie sua pele enquanto dorme! Com 93% de eficácia, o Clareador Dérmico Cicatribem suavi | cicatribem.com.br | [ver](https://www.facebook.com/ads/library/?id=2146087419506014) |
| 55 |  | Thales Bretas Real com La Roche-Posay | O que te incomoda mais: manchas ou rugas? 👀 @larocheposay lançou um produto que trata os  | www.drogaraia.com.br | [ver](https://www.facebook.com/ads/library/?id=1014178151681932) |
| 153 |  | Caroline Aguiar Institute com Principia  | Pele oleosa também merece uma rotina prática, eficiente e com ativos que realmente fazem d | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=986021014152474) |
| 153 |  | Dr. Rodrigo Andrade com Cicatribem | 🤯 A VIDA JÁ É COMPLICADA DEMAIS, SEU SKINCARE NÃO PRECISA SER! 🐻❤️ Para que complicar a  | cicatribem.com.br | [ver](https://www.facebook.com/ads/library/?id=1667212537902296) |
| 227 |  | Dr. Rodrigo Andrade com Cicatribem | O CLAREADOR VIRALIZADO DAS FAMOSAS (CLAREIA ATÉ PASSADO OBSCURO!) 🤫 Carinhosa, você está  | cicatribem.com.br | [ver](https://www.facebook.com/ads/library/?id=1404903150825544) |
| 227 |  | Dr. Rodrigo Andrade com Cicatribem | COMPARTLHA URGENTE antes que tirem o vídeo do ar🚨 esse creme faz TANTA coisa que a indúst | cicatribem.com.br | [ver](https://www.facebook.com/ads/library/?id=2576843616068377) |
| 43 |  | Hidrabene | Rotina completa para combate às manchas, reunindo sabonete líquido facial, protetor solar  | hidrabene.com.br | [ver](https://www.facebook.com/ads/library/?id=2141529933449605) |
| 203 |  | Bruna Saito com Cicatribem | Testei o clareador viral que a MC Mirella usa ✨😱 Esse é o clareador dérmico da @cicatribe | cicatribem.com.br | [ver](https://www.facebook.com/ads/library/?id=3006465119690569) |
| 152 |  | Dr. Rodrigo Andrade com Principia Skinca | 5 QUEIXAS E OS PRODUTOS +EFETIVOS PARA CADA UMA! 🤩 Carinhosa, o Dr. Ursinho separou os 5  | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=981569194419292) |
| 228 |  | Ana Carolina Barretto com Cicatribem | ✨ Clarear a pele nunca foi tão simples (e eficaz)! ✨ O Clareador Dérmico Cicatribem atua e |  | [ver](https://www.facebook.com/ads/library/?id=1795258464501473) |
| 74 |  | Drica Divina com Profuse | O número que mudou a forma como eu enxergo o envelhecimento da pele: 25. 👀 Pois é. A gent | www.drogaraia.com.br | [ver](https://www.facebook.com/ads/library/?id=1029645842996732) |
| 179 |  | Dr. Rodrigo Andrade com Principia Skinca | 🚨 ESSA HORA É NOSSA! DEPOIS DE MUITA REZA BRABA, ELE CHEGOU! 🙏 Carinhosa, depois de pedi | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1362970039189739) |
| 384 |  | Domine Seu Melasma | Na medicina tradicional chinesa, o rosto é como um mapa que reflete a saúde interna do cor | www.instagram.com | [ver](https://www.facebook.com/ads/library/?id=1513313669852034) |

### 5. cronograma capilar (~2.300 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=cronograma%20capilar&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 213 | 2 | Eudora | Outlet Eudora: seus favoritos com descontos de até 60% OFF! 💥 | eudora.com.br | [ver](https://www.facebook.com/ads/library/?id=1435457211376810) |
| 55 | 2 | BRAÉ HAIR CARE | Conheça os produtos Braé ✨ Cuidado profissional para tratar, fortalecer e realçar a beleza | brae.com.br | [ver](https://www.facebook.com/ads/library/?id=1734009754385882) |
| 143 |  | Bella Phytus | Se seu cabelo não cresce, quebra fácil e vive fraco… o problema pode ser falta de nutrição |  | [ver](https://www.facebook.com/ads/library/?id=945858581753605) |
| 13 | 2 | MeoMeo | Lançamento: Honey Butter, a nova máscara da Meo Meo. As três etapas do cronograma capilar  |  | [ver](https://www.facebook.com/ads/library/?id=28542526242075063) |
| 98 |  | Dot Cosméticos |  | dotcosmeticos.com.br | [ver](https://www.facebook.com/ads/library/?id=1530012355526436) |
| 91 |  | Borabella | ✨ Linha Day Use para cabelo na Dot Cosméticos Cuidado diário com resultado de salão 💆‍♀️  | dotcosmeticos.com.br | [ver](https://www.facebook.com/ads/library/?id=1040588125248764) |
| 91 |  | Borabella | Borabella Óleo de Argan e Macadâmia Reparador de Pontas 7ml, sela as cutículas proporciona | dotcosmeticos.com.br | [ver](https://www.facebook.com/ads/library/?id=925164500602936) |
| 5 | 7 | Skala Brasil | Uma solução completa para seu cronograma capilar. Novas máscaras Skala Brasil. Para todos  | www.skala.com.br | [ver](https://www.facebook.com/ads/library/?id=28418678334491771) |
| 91 |  | Borabella | ✨ Escova mais prática, rápida e com resultado profissional de verdade. O Borabella Brush 9 | dotcosmeticos.com.br | [ver](https://www.facebook.com/ads/library/?id=889043127124034) |
| 54 |  | Garimpos Da Dany | Seu banheiro não precisa parecer uma loja de cosméticos para você fazer um cronograma capi | s.shopee.com.br | [ver](https://www.facebook.com/ads/library/?id=1093484339848091) |
| 98 |  | Dot Cosméticos | Conheça o alisamento de alta performance da Não Chore Mais, com resultado duradouro, fios  | dotcosmeticos.com.br | [ver](https://www.facebook.com/ads/library/?id=1534949061759334) |
| 20 |  | Prohall | Adquira os melhores produtos do Brasil com frete grátis, cashback, cupons e muito mais! ✨  | lojaprohall.com.br | [ver](https://www.facebook.com/ads/library/?id=2116365775632379) |
| 207 |  | Eudora | Primeira compra? Ganhe Frete Grátis + 15% OFF com o cupom BENVINDA15! ✨ | eudora.com.br | [ver](https://www.facebook.com/ads/library/?id=1480182287451664) |
| 13 |  | Vult | farmabelle ep4 - cronograma capilar não existe! ou pelo menos não do jeito que a internet  | www.google.com | [ver](https://www.facebook.com/ads/library/?id=1423468553323549) |
| 13 |  | Eudora | Recupere a força e o brilho do seu cabelo com Eudora Siàge! Aproveite os descontos de até  | eudora.com.br | [ver](https://www.facebook.com/ads/library/?id=28907664048872387) |
| 114 |  | Lanox Pro | Aquele resultado luxuoso e impecável que você sempre sonhou, agora na sua própria casa. 🤍 | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1753660232432699) |
| 469 | 2 | Mio Capelli | Resultado de salão, na sua casa. 🌸 Na Mio Capelli, cada produto foi pensado pra quem quer |  | [ver](https://www.facebook.com/ads/library/?id=1130256475592378) |
| 145 |  | Sueli Do Salomão |  | naturever.com.br | [ver](https://www.facebook.com/ads/library/?id=1464988301519509) |
| 11 | 2 | Prohall | JÁ COMEÇOOOU! O Esquenta Black Prohall chegou 🔥 O site todo com até 60% OFF pra você gara | lojaprohall.com.br | [ver](https://www.facebook.com/ads/library/?id=1944940109810478) |
| 161 |  | Tridium Cosméticos | Isso parece cabelo de comercial… mas é Cronograma Capilar Tridium. Hidrata, nutre e recons | tridiumcosmeticos.com.br | [ver](https://www.facebook.com/ads/library/?id=918626681223541) |

### 6. kiwify (~15.000 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=kiwify&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 568 |  | Luciana RH Sincero | Cansado de assistir o incompetente sendo promovido? Não aguenta mais fazer tudo certo e nu | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=456003130916186) |
| 157 | 2 | Michaelle Almeida Nails | 🔥 MÉTODO CONTROLE MÁXIMO NO MOLDE F1 🔥 Se você ainda sofre com unhas que descolam, quebr |  | [ver](https://www.facebook.com/ads/library/?id=1321564646611189) |
| 263 |  | Luigi Fernandes | Nunca mais pague por Lead Desqualificado. | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=2248603012333324) |
| 507 |  | cozinhadoipe.com.br | Você quer inovar nos seus atendimentos como profissional da saúde? • Protocolo detox funci |  | [ver](https://www.facebook.com/ads/library/?id=592986339972918) |
| 156 |  | Michaelle Almeida Nails | ✨ Por que o Molde F1 pode transformar sua mesa de atendimento? ⠀ ✔️ Agilidade na aplicação | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1315540257454664) |
| 104 | 3 | Makeup_Calixto | ⚠️Acaba hoje!! Destrave os PENTEADOS EXPRESSl🚀Chega de perder clientes por causa da conco |  | [ver](https://www.facebook.com/ads/library/?id=1501784107788616) |
| 392 |  | Thaiscristinida | Qual o preço do seu próximo nível? |  | [ver](https://www.facebook.com/ads/library/?id=2007297860087156) |
| 127 | 3 | Makeup_Calixto | 🔥ACABA HOJE!‼️Chega de perder clientes por causa de técnicas desatualizadas e amadoras!!  |  | [ver](https://www.facebook.com/ads/library/?id=1486060652733367) |
| 173 |  | Legal Growth | 🚨 A SUA MARGEM ESTÁ BAIXA PORQUE O GOVERNO É SEU MAIOR SÓCIO. Você vira noites otimizando |  | [ver](https://www.facebook.com/ads/library/?id=2046891319372360) |
| 112 | 2 | Spedy | Presta atenção nisso aqui para não arrumar dor de cabeça com a Receita Federal no futuro.  |  | [ver](https://www.facebook.com/ads/library/?id=2072840683664280) |
| 42 |  | SendFlow | É novo por aqui? Conheça as principais funcionalidades do SendFlow. Se ainda tiver dúvidas | sendflow.com.br | [ver](https://www.facebook.com/ads/library/?id=1056505250343431) |
| 301 |  | Dr. Rafael Querino |  |  | [ver](https://www.facebook.com/ads/library/?id=1525981878674642) |
| 174 | 2 | Rodrigo Lima | Descomplicando a UI24R de uma vez por todas! Entenda como essa ferramenta pode transformar | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=825341926827800) |
| 503 |  | Stories Criativo | Esteticista animal 🐾Tenha stories lindos e criativos! adesivos universais e nichados com  | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1613999212596741) |
| 147 | 2 | Victor Bass | Você toca baixo, mas sente que sua linha não evolui? Sempre tônica, pouca variação, pouca  | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=981149301177825) |
| 133 |  | Guia da Noiva | See Details |  | [ver](https://www.facebook.com/ads/library/?id=2629979224064764) |
| 130 |  | Enferya Resumos | A enfermagem evolui todos os dias, e quem atua na Atenção Básica precisa acompanhar. O Gui | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1430501719107899) |
| 159 | 3 | Paulo Mendes Beauty Studio | 🔥 Comece hoje na área de Brow & Lash e veja sua carreira e sua renda se transformarem! Cl |  | [ver](https://www.facebook.com/ads/library/?id=1655834425660069) |
| 143 |  | FPA na prática | 🚀 Eleve sua Carreira com nosso Treinamento de FP&A! Aprenda a dominar análises financeira | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=931559613259558) |
| 92 |  | Larissa Lima beauty |  | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1614181246708334) |

### 7. kiwify pele (~150 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=kiwify%20pele&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 154 |  | Dra Christiane Scardua - Harmonização Fa | Comece por essa mais baixa, usando apenas uma gotinha para rosto todo. Usar apenas a noite | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1242800397927766) |
| 14 | 2 | Natasha Silva Sobrancelhas | Você ainda se sente perdida na hora de fazer uma sobrancelha? Demora no mapeamento, tem me | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=2049197152467415) |
| 12 |  | Alexandravaini | @alexandra_vitiligo Uma dúvida de uma seguidora virou assunto por aqui! 💛 E é isso que eu | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1081502631546600) |
| 1191 |  | Starbam - Store | 🔰 Pele Saudável O segredo da pele perfeita👩🏻 🔰 E-book com mais de 14 capítulos " 📖 🔰 |  | [ver](https://www.facebook.com/ads/library/?id=656578753021932) |
| 13 |  | Stories Criativo | Transforme stories comuns em stories irresistíveis em segundos 😍 Pacote completo com + de | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1004692305978081) |
| 3 | 4 | Marinho Film | 📸Dê aos seus vídeos de iPhone um acabamento cinematográfico em poucos cliques. Você não p | kiwify.app | [ver](https://www.facebook.com/ads/library/?id=29340308465577197) |
| 4 |  | AGT Ars Grimoirum Traduções com Marcelos | Nossas primeiras obras traduzidas estão chegando! Depois de um longo trabalho de pesquisa, | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1055153727511117) |
| 11 |  | Juliane Schiavini | E se você pudesse fazer aquela maquiagem linda, sozinha, sempre que quisesse? Para sair, t | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1130731806490541) |
| 11 |  | Juliane Schiavini | Você tem maquiagem em casa, mas sente que não sabe aproveitar tudo o que ela pode fazer po | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=4512872365647952) |
| 45 |  | Dra Larissa Guimarães | Curso completo de Microagulhamento com Ativos com Demonstração ao vivo para transformar su | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1735118224413434) |

### 8. kiwify cabelo (~99 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=kiwify%20cabelo&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 25 |  | Talita Lorraine Daily | Comente "FIGURINHAS" para ter acesso ao link de compra ou clique no link na minha bio🤍✨ # | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=2216488902267964) |
| 24 |  | Mabel Mega Hair | Cansada de comprar cursos de Mega Hair e continuar cheia de dúvidas na hora da prática? Ch | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1414359793460118) |
| 7 | 2 | Fábio Oliver Academy | 🎨 **Você já sabe que dominar a cor vai muito além de seguir uma fórmula.** O verdadeiro d | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1412163983964415) |
| 6 | 2 | Lipedaily | Ganha mais que 85% dos brasileiros e ta vivendo como? Pra se organizar melhor financeirame |  | [ver](https://www.facebook.com/ads/library/?id=1803635630947039) |
| 5 | 4 | Planilha Descomplica | Se você não controla seu dinheiro, alguém controla por você. Essa é a planilha que eu uso  |  | [ver](https://www.facebook.com/ads/library/?id=1839326943878459) |
| 13 |  | Nutri.danifernandess | O que todos esses sintomas podem ter em comum? 👀 Cansaço, queda de cabelo, dificuldade pa | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=2576160042851630) |
| 77 | 2 | kaua_bnnss | Comece a faturar hoje! #kiwify #marketingdigital #kiwifyafiliado #vendasonline #dinheiro |  | [ver](https://www.facebook.com/ads/library/?id=1060196976472306) |
| 2 |  | Edjane Perfumes | ✨ Crie perfumes de luxo dentro da sua própria casa! 🌸 Você não precisa ser químico nem te | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1609964690676476) |
| 0 | 3 | Bem dita biocosméticos |  |  | [ver](https://www.facebook.com/ads/library/?id=1639031231084025) |

### 9. kiwify maquiagem (~110 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=kiwify%20maquiagem&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 127 | 3 | Makeup_Calixto | 🔥ACABA HOJE!‼️Chega de perder clientes por causa de técnicas desatualizadas e amadoras!!  |  | [ver](https://www.facebook.com/ads/library/?id=1486060652733367) |
| 59 | 31 | Olhos que Encantam | A lista com os melhores fornecedores de maquiagem para loja de 10! |  | [ver](https://www.facebook.com/ads/library/?id=1788022475545838) |
| 11 |  | Produtos Digitais | 🎄 Dezembro está chegando! Organize seus atendimentos com o Protocolo de Dezembro, editáve | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1404412251262833) |
| 30 | 2 | Olhos que Encantam | Resolvi ensinar o segredo que me fez mudar de patamar vendendo maquiagem pela internet! |  | [ver](https://www.facebook.com/ads/library/?id=1391021195916132) |
| 5 | 2 | Costura com Jéssica Lais | Você também consegue fazer a sua Nécessaire Trio! Uma peça prática, versátil e com 3 compa | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=2154674595175997) |
| 29 | 2 | Olhos que Encantam | Revelei os fornecedores das maiores redes de lojas de maquiagem do Brasil! | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1137386761964279) |
| 30 |  | Olhos que Encantam | Os Fornecedores que são a fonte das lojas de 10! | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=2185870822307288) |
| 11 |  | Juliane Schiavini | E se você pudesse fazer aquela maquiagem linda, sozinha, sempre que quisesse? Para sair, t | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1130731806490541) |
| 10 | 2 | Lista de Fornecedores de Maquiagem para  | Lista de Fornecedores de Acessorios para voce montar sua loja de R$10,00 , fornecedores co | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1360599319247521) |
| 11 |  | Juliane Schiavini | Você tem maquiagem em casa, mas sente que não sabe aproveitar tudo o que ela pode fazer po | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=4512872365647952) |
| 2 |  | Costura com Jéssica Lais | Você também consegue fazer a sua Nécessaire Cristal! Uma peça linda, versátil e cheia de p | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1482250213964259) |
| 77 | 2 | kaua_bnnss | Comece a faturar hoje! #kiwify #marketingdigital #kiwifyafiliado #vendasonline #dinheiro |  | [ver](https://www.facebook.com/ads/library/?id=1060196976472306) |
| 6 |  | Jack Brito Beauty | Você já comprou uma base que parecia perfeita, mas, quando aplicou no rosto, percebeu que  | pay.kiwify.com.br | [ver](https://www.facebook.com/ads/library/?id=1105991345127841) |

### 10. acesso imediato cabelo (~340 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=acesso%20imediato%20cabelo&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 143 |  | Bella Phytus | Se seu cabelo não cresce, quebra fácil e vive fraco… o problema pode ser falta de nutrição |  | [ver](https://www.facebook.com/ads/library/?id=945858581753605) |
| 10 |  | Eudora com Niina Secrets | #publi A @niinasecrets veio contar uma novidade, agora Eudora faz parte do maior programa  | www.eudora.com.br | [ver](https://www.facebook.com/ads/library/?id=1656195186031601) |
| 15 |  | Gue Oliveira | Passar 3 horas em pé fazendo a montagem de uma única cliente não é sinônimo de qualidade,  | lp.gacacademy.com.br | [ver](https://www.facebook.com/ads/library/?id=1078038778188702) |
| 27 | 4 | Beleza com Poder | 🔥 Aprenda a fazer tranças nagô impecáveis mesmo sem experiência! Descubra técnicas profis |  | [ver](https://www.facebook.com/ads/library/?id=1513618787192523) |
| 63 | 10 | Beleza com Saúde | 🚨 Seu cabelo tá pedindo socorro e você ainda não fez nada sobre isso? Chegou o Protocolo  |  | [ver](https://www.facebook.com/ads/library/?id=1810013990433124) |
| 107 | 3 | Fabiana Steffens - Cursos para cabeleire | Curso online com certificado de escova. Aprenda a fazer um acabamento perfeito pra agradar | split.vkdigital.com.br | [ver](https://www.facebook.com/ads/library/?id=2043523136567875) |
| 90 | 2 | Fabiana Steffens | Curso online com certificado de escova. Aprenda a fazer um acabamento perfeito pra agradar | split.vkdigital.com.br | [ver](https://www.facebook.com/ads/library/?id=1044561131320064) |
| 90 |  | Fabiana Steffens - Cursos para cabeleire | Curso online de corte para cabeleireiras que querem aprender os 5 cortes mais pedidos do s | split.vkdigital.com.br | [ver](https://www.facebook.com/ads/library/?id=1627025815804787) |
| 90 | 2 | HairPro Academy | 🛑 Por que tem cabeleireiro na sua região cobrando 3x mais que você pelo mesmo serviço de  |  | [ver](https://www.facebook.com/ads/library/?id=1552692042580367) |
| 480 | 3 | Zazá Martins | ✨ COMENTE Znature e saiba mais! Camuflagem de Fios Brancos sem química com apenas um produ |  | [ver](https://www.facebook.com/ads/library/?id=1242701237264225) |
| 12 | 3 | Goodnovel | No cartório, meu noivo não apareceu, mas seu irmão, sim. — Meu irmão está ocupado mimando  | hegbm.com | [ver](https://www.facebook.com/ads/library/?id=1085010090808947) |
| 47 | 2 | Barbearia Allan Gomes - Estética masculi | 🚨 ATENÇÃO CAMPO GRANDE E REGIÃO 🚨 Agora você não precisa mais sair da sua região pra res |  | [ver](https://www.facebook.com/ads/library/?id=1375084788169344) |
| 37 | 5 | Mapas Capilares | +100 Mapas Mentais Ilustrados para Saúde Capilar 🧠 Aqui você vai encontrar: ✅ +100 mapas  |  | [ver](https://www.facebook.com/ads/library/?id=1401442345418337) |
| 115 |  | Zazá Martins | Comente Znature e saiba mais! Camuflagem de Fios Brancos sem química com apenas um produto | www.instagram.com | [ver](https://www.facebook.com/ads/library/?id=1958877374902199) |
| 21 | 4 | Carla Lacoque | Ainda sente insegurança na hora de fazer penteados em cabelos cacheados e crespos? 👀 Você |  | [ver](https://www.facebook.com/ads/library/?id=2723825464738743) |
| 37 |  | Alice Pereira | 🌿 Você ainda usa óleos essenciais sem saber a quantidade certa de gotas? E se o motivo de | materialpronto.pro | [ver](https://www.facebook.com/ads/library/?id=4650524841876249) |
| 9 | 2 | Ele e ela | No dia em que a ex-namorada do meu noivo voltou ao país, ele me deixou sozinha mais uma ve | huazxc.com | [ver](https://www.facebook.com/ads/library/?id=1892918871673027) |
| 76 |  | Dede Leme - Consultoria de Imagem & Esti | Receba GRÁTIS o kit com 25 especializações e nunca mais compre outro curso. |  | [ver](https://www.facebook.com/ads/library/?id=1045954347813281) |
| 55 | 2 | Droga Lubi | Tem na Lubi - ep.1 🩷 Aqui você encontra as melhores ofertas e o melhores achadinhos da re | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1562102498731085) |
| 21 |  | Rafael Takeda |  | saudefit.net | [ver](https://www.facebook.com/ads/library/?id=959154733900096) |

### 11. acesso imediato maquiagem (~150 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=acesso%20imediato%20maquiagem&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 90 | 10 | Juliana Celeiro MakeUp | Os Segredos da Maquiagem Sofisticada por apenas R$ 47. Aprenda, em menos de 2 horas, as té | maquiagemsofisticada.julianaceleiro.com.br | [ver](https://www.facebook.com/ads/library/?id=1769498110902656) |
| 9 | 2 | Camila Barreto | ⭐⭐⭐⭐⭐ (4.9) | camilabarreto.online | [ver](https://www.facebook.com/ads/library/?id=948409387881229) |
| 41 | 3 | Lista de Fornecedores de Maquiagem para  | Aqui você encontra os melhores fornecedores, todos confiáveis, que vão facilitar (e muito! |  | [ver](https://www.facebook.com/ads/library/?id=938579505355949) |
| 24 |  | 2Gther | Dentista, está perdendo dinheiro na impressão 3D? 💸 Aprenda o Método 2Gther e aumente sua | 2gther.com.br | [ver](https://www.facebook.com/ads/library/?id=1759591908524687) |
| 33 | 4 | Lista de Fornecedores de Maquiagem para  | Lista de Fornecedores de Acessorios para voce montar sua loja de R$10,00 , fornecedores co |  | [ver](https://www.facebook.com/ads/library/?id=1056275400516777) |
| 2 | 5 | Barbara Maria Emily | Para se vingar da sua acosadora, Camila rouba a identidade dela e engana um desconhecido r |  | [ver](https://www.facebook.com/ads/library/?id=1401975102147505) |
| 37 | 3 | Onna ateliê | Você já fez sua análise de coloração pessoal, mas ainda erra na maquiagem? Batom te apagan |  | [ver](https://www.facebook.com/ads/library/?id=1659000062509791) |
| 1 |  | Lulpidruck Jondvoblinu | Para se vingar da sua acosadora, Camila rouba a identidade dela e engana um desconhecido r | w2a.storyreel.life | [ver](https://www.facebook.com/ads/library/?id=2022989775076820) |
| 3 | 2 | Consultório 3D | Quanto você gasta hoje com o laboratório para entregar coroas e restaurações indiretas aos | consultorio3d.com.br | [ver](https://www.facebook.com/ads/library/?id=2231815914060155) |
| 2 |  | Raquel Daroz MakeUp | O Guia Intacta já transformou a rotina de maquiagem de centenas de mulheres. Acesso imedia | raquedaroz.online | [ver](https://www.facebook.com/ads/library/?id=1137528275271785) |
| 19 | 2 | Marina Costa Make | 💄 Aprenda maquiagem do jeito CERTO e transforme isso em renda! Enquanto muita gente ainda |  | [ver](https://www.facebook.com/ads/library/?id=1653402263164159) |
| 5 | 2 | Thayany beauty | Sua maquiagem é profissional. Sua precificação também deveria ser. A Planilha M.A.P.A. mos | thay-rose.vercel.app | [ver](https://www.facebook.com/ads/library/?id=1485255117079928) |
| 41 |  | Guilherme Nogueira Make Up | A GN play makeup é um Instagram privado, com aulas novas todos os meses, a plataforma de a | gnplaymakeup.com.br | [ver](https://www.facebook.com/ads/library/?id=894356146866549) |
| 18 |  | WebHoje Beleza na Prática | 🎨 Descubra como a análise de cores pode ajudar na escolha de roupas, acessórios e maquiag | cursoskincarediario.com | [ver](https://www.facebook.com/ads/library/?id=2121780705116914) |
| 2 |  | Academia de Boas Maneiras | ✨ Transforme conhecimento em um diferencial para o seu salão de beleza! Aprenda a aplicar  |  | [ver](https://www.facebook.com/ads/library/?id=2433665620497832) |
| 31 |  | Lista de Fornecedores de Maquiagem para  | Aqui você encontra os melhores fornecedores, todos confiáveis e que vão, facilitar sua vid | meufornecedorapp.lovable.app | [ver](https://www.facebook.com/ads/library/?id=1066712502629894) |
| 3 |  | Mundo Das Artesã | Você trabalha com cosméticos, personalizados ou embalagens artesanais? 📦✨ Tenha acesso a  | packoficial.com | [ver](https://www.facebook.com/ads/library/?id=1801842901148500) |
| 3 |  | Andreynna Rocha | "Como eu consigo vender maquiagem por R$10 e ainda lucrar?" 👀 O segredo está nos forneced | andreynna.com.br | [ver](https://www.facebook.com/ads/library/?id=4699620190184410) |

### 12. ebook skincare (~28 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=ebook%20skincare&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 115 | 2 | School of Natural Skincare | Most DIY skincare recipes online are missing one critical thing - cosmetic science. This l |  | [ver](https://www.facebook.com/ads/library/?id=982940751172712) |
| 130 | 5 | School of Natural Skincare | This beautiful 100-page ebook covers everything you need to kickstart your skincare formul |  | [ver](https://www.facebook.com/ads/library/?id=27581630341455490) |
| 34 |  | Dra Karinne Vargas | Comente MELASMA e receba um e-book com todos os detalhes para controlar o seu melasma. #de | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1343500427632033) |
| 130 | 3 | School of Natural Skincare | 🌸 Get Our $9 Recipe Book Today 🌸 In this beautiful 100-page ebook you'll get everything  |  | [ver](https://www.facebook.com/ads/library/?id=2824232327920781) |
| 5 |  | Universo Feminino | ✨ Mulheres estão descobrindo uma nova forma de cuidar da pele sem precisar gastar fortunas | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=2576027722913451) |

### 13. depois dos 30 pele (~1.500 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=depois%20dos%2030%20pele&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 179 |  | Dr. Rodrigo Andrade com Principia Skinca | 🚨 ESSA HORA É NOSSA! DEPOIS DE MUITA REZA BRABA, ELE CHEGOU! 🙏 Carinhosa, depois de pedi | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1362970039189739) |
| 220 |  | Sterilair | ℹ️ Sterilair é o purificador de ar melhor avaliado do Brasil, com Padrão NASA (ISO5) de es | sterilair.com.br | [ver](https://www.facebook.com/ads/library/?id=1622454052127180) |
| 204 | 3 | Clinica Volpe Estética Corporal | Dá uma reparada na sua mão 🧐 Depois dos 45 anos, com a queda do estrogênio, esse processo |  | [ver](https://www.facebook.com/ads/library/?id=1516036166713083) |
| 160 | 2 | Emanueli Escobar com Vizzela Cosméticos | Maquiagem completa com produtos da @vizzelaoficial 🤍 Não é segredo pra ninguém que eu amo |  | [ver](https://www.facebook.com/ads/library/?id=1845544036424817) |
| 53 | 2 | mariamaquiada com Meu.ollie | Tutorial dessa make glow e super fácil para o dia a dia! Gostaram? 😍✨ Todos os produtos u |  | [ver](https://www.facebook.com/ads/library/?id=1630428938746786) |
| 11 |  | Raíra com Drogaria São Paulo | Na compra de 2 unidades de Systane™ UL na @drogariasaopaulo, você ganha 30% de desconto em | www.drogariasaopaulo.com.br | [ver](https://www.facebook.com/ads/library/?id=2049729125676138) |
| 178 | 2 | Sociedade dos Fundamentos | Durante muitos anos, eu achava que retrato a óleo era só para "quem nasce com dom". Tentav |  | [ver](https://www.facebook.com/ads/library/?id=4569624890030964) |
| 55 | 4 | Le Moritz | Nos primeiros cinco anos de menopausa, a mulher pode perder até 30% do colágeno da pele. E | lemoritz.com.br | [ver](https://www.facebook.com/ads/library/?id=1756501329025045) |
| 207 |  | Dra Marilia Iglésias | Tem uma frase que muitas pacientes começam a repetir depois dos 30: "Eu tô com cara de can |  | [ver](https://www.facebook.com/ads/library/?id=1707632737339220) |
| 595 |  | FaceDoctor Florianópolis | Resultado Bioestimulador Sculptra após 30 dias na Face Doctor ✨ Quem disse que a pele firm | instagram.com | [ver](https://www.facebook.com/ads/library/?id=650626940715441) |
| 17 |  | paulafronerr com Meu.ollie | O novo Pó Compacto com FPS 50 une maquiagem e proteção solar em um só produto. Além de dei | meuollie.com.br | [ver](https://www.facebook.com/ads/library/?id=1037507569330187) |
| 60 |  | saralivorati.makeupartist com Meu.ollie | Quem disse que maquiagem prática não pode ter alta proteção solar? ☀️✨ No meu dia a dia, e | meuollie.com.br | [ver](https://www.facebook.com/ads/library/?id=1837790860929813) |
| 62 | 2 | Feel | Você já conhece a Feel? Criamos soluções que potencializam a saúde íntima e também nossos  | somosfeel.com.br | [ver](https://www.facebook.com/ads/library/?id=4367808466769993) |
| 146 |  | Clínica Fabíola P. Takeuti - Dermatologi | Cada vez que eu vejo tantos mitos sobre a pele sendo compartilhados… eu lembro do porquê e | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1326111349450442) |
| 68 |  | Principia Skincare Pro | Descubra rotinas de skincare personalizadas para as características da sua pele. Aproveite | principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1022446127249758) |
| 153 |  | Taís Lopes | Os 12 segredos são 12 passos rápidos para você melhorar hoje mesmo sua implantação, quer t | taislopes.com.br | [ver](https://www.facebook.com/ads/library/?id=2059040728157451) |
| 104 | 5 | Vizzela Cosméticos | Chega de escolher entre cuidar da pele ou fazer uma maquiagem bonita. ✨ O BB Cream FPS 30  |  | [ver](https://www.facebook.com/ads/library/?id=3589823154506022) |
| 293 |  | Day Hospital Alumni | A abdominoplastia é um procedimento indicado para quem apresenta flacidez na região abdomi | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1250389970479236) |
| 197 |  | Dra Rochelli Scalco | "Você está cansado?" Essa é uma pergunta que muitas pessoas escutam, mesmo depois de uma b | instagram.com | [ver](https://www.facebook.com/ads/library/?id=845022707860312) |
| 109 | 2 | CLUBE DA PELE | Sua rotina de skincare está piorando o melasma da sua cliente sem você perceber? Pele sens | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1512489677021839) |

### 14. automaquiagem (~1.200 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=automaquiagem&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 60 | 2 | Le Moritz | ⭐⭐⭐⭐⭐ "Depois que comecei a usar os produtos Le Moritz, minha pele ficou muito mais bonita | lemoritz.com.br | [ver](https://www.facebook.com/ads/library/?id=1017886834582909) |
| 131 |  | Niki Miguel | A Virgínia indicou e agora você também pode aprender 💄✨ Curso de AutoMake 100% online, pr | v0-make-makeup-course.vercel.app | [ver](https://www.facebook.com/ads/library/?id=974835422129004) |
| 53 | 2 | Hérika Fagundes Makeup com Guava | Essa máscara da @guavaskin é SURREAL! 💚🌟 / alonga até os cílios mais curtinhos ou retos, |  | [ver](https://www.facebook.com/ads/library/?id=1569302421211434) |
| 134 |  | Natalia Romanini | Meninas do Tatuapé e região, chegou a hora de descomplicar a maquiagem! Na minha Aula de A | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1512610826533227) |
| 81 |  | Marcela Brasileiro | Aula de Automaquiagem em São José dos Campos - SP Quer aprender dicas e técnicas de automa | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=2241164850013382) |
| 83 | 2 | Studio Jessica Egidio Beauty | Inscrições abertas para o Curso Makeup Pro Vou te ensinar tudo que aprendi em 8 anos nessa |  | [ver](https://www.facebook.com/ads/library/?id=1086580067389513) |
| 96 |  | natyalvesfaria | Você também compra maquiagem, assiste vídeos na internet e mesmo assim sente dificuldade p | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=897295380085096) |
| 137 |  | Curso de automaquiagem | Descubra como se maquiar de forma simples, rápida e profissional, mesmo se você nunca acer | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=828981620007895) |
| 353 |  | Ana Paula Hoft - Diretora de vendas inde | Campo Largo e Balsa Nova, chegou sua oportunidade de aprender automaquiagem com técnica, i | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=755105377576135) |
| 20 |  | Drogaria FarmaBem | Quer aprender a fazer sua automaquiagem? No dia 23/10, a Santo Remédio Torquato II recebe  | instagram.com | [ver](https://www.facebook.com/ads/library/?id=2955595434817686) |
| 151 |  | Katia Chaves | Sua maquiagem nunca mais será a mesma! 💋 Você não precisa ser profissional para ter um re | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1308124651282503) |
| 344 |  | Michelly Palma Makeup | A esponja com efeito airbrush está de volta! Ultra macia, de poros fechados e com acabamen |  | [ver](https://www.facebook.com/ads/library/?id=1723350581672938) |
| 156 |  | Priscila Cavichi | Você me conheceu onde ? Já foi minha aluna ? Conta aqui pra quem não me conhece 😍👇🏼 | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1801571751249104) |
| 125 |  | Fernanda Soranco | Descubra como se maquiar de forma simples, rápida e profissional, mesmo se você nunca acer | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=998587439549592) |
| 185 |  | Rafael De Sales Matto | 💄 Aprenda a realçar sua beleza com um curso prático e completo! 💄 Seja para o dia a dia  | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1860421157976722) |
| 125 | 2 | Vanessa Brandão | 🚨Atenção Goiânia! 🚨 Aula de Automaquiagem – Simples e Descomplicada Aprenda a se maquiar | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1646139156468559) |
| 140 |  | Milena Freire | 📍 Aula de Automake em Fortaleza NÃO TENHO MAQUIAGEM, POSSO FAZER A AULA? 🛑💄 Essa é a dú | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=775406048897849) |
| 174 |  | Scheila Führ Zilles | Ivoti e região, chegou uma aula de automaquiagem pensada pra quem quer aprender com técnic |  | [ver](https://www.facebook.com/ads/library/?id=1478833387030939) |
| 133 |  | Beauty School Teresópolis | ✨ QUAL É A SUA PAIXÃO NA BELEZA? TEMOS O CURSO PERFEITO PARA VOCÊ! ✨ Na Beauty School & SP | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=2003200330560682) |
| 130 |  | Aurora Care Academy | 50 segundos. Todos os nossos cursos. A @dani_klemann conseguiu 🥳 E olha... ela teve sorte | instagram.com | [ver](https://www.facebook.com/ads/library/?id=3703779416465518) |

### 15. coloração pessoal (~990 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=colora%C3%A7%C3%A3o%20pessoal&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 33 | 2 | ChatGPT | Encontre sua melhor paleta de cores com o ChatGPT grátis 1. Clique 2. Envie sua foto 3. Re |  | [ver](https://www.facebook.com/ads/library/?id=2473383483168531) |
| 19 |  | ChatGPT | Encontre sua melhor paleta de cores com o ChatGPT grátis 1. Clique (o prompt está pronto)  |  | [ver](https://www.facebook.com/ads/library/?id=3116696358533239) |
| 60 | 3 | Le Moritz | ⭐⭐⭐⭐⭐ "Depois que comecei a usar os produtos Le Moritz, minha pele ficou muito mais bonita | lemoritz.com.br | [ver](https://www.facebook.com/ads/library/?id=1017886834582909) |
| 327 |  | Lilly Perfumaria | Vem comigo conhecer a melhor e mais completa perfumaria da cidade de salto 🤩 | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1117834983763393) |
| 212 |  | Milvo Multimarcas | Estoque completo da nossa loja 1 na rua Pedro Gusso 2598 cic | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1137287641822244) |
| 137 |  | Aline Garoncio Academy | Criar um loiro estilo Virginia só com tinta? ✨ Sim, é possível. Mas não é sorte, nem mágic | instagram.com | [ver](https://www.facebook.com/ads/library/?id=2646565792406139) |
| 59 |  | Semi Jóias Ticoman Premium | 🚨 Se você gosta de chamar atenção, esse conjunto é para você! Cordão e pulseira laminados | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1580926843149353) |
| 116 |  | Aline Garoncio Academy | 🚨Precisa aprender trabalhar com coloração e retirar preto comente aqui sobre EU QUERO 👇 | instagram.com | [ver](https://www.facebook.com/ads/library/?id=4473041489682336) |
| 76 |  | Adriano Portugal fotografia com Evoto AI | Agora qualquer pessoa pode fazer edições com qualidade profissional usando o Evoto Mobile. | itunes.apple.com | [ver](https://www.facebook.com/ads/library/?id=1204758695141328) |
| 368 |  | Ceramfix com artporcelainetreinamentos | 📲 Confira no vídeo como o disco errado pode comprometer a superfície do seu porcelanato!  | www.instagram.com | [ver](https://www.facebook.com/ads/library/?id=1336912401240809) |
| 30 |  | Ticoman18k PR |  | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=4513063862282792) |
| 110 |  | Instituto Bella Assumpção | O ruivo de alto padrão que você procurava agora está na Zona Sul. Bella Assumpção combina  | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1336933161302908) |
| 34 |  | Exalla Cosmeticos | Você sabia que agora tem uma Exalla em Pacajus no @viramarshopping ?! 🔥✨☀️🎉 Estamos te e | instagram.com | [ver](https://www.facebook.com/ads/library/?id=3301357390254654) |
| 60 |  | Semi Jóias Ticoman Premium | Cor de ouro18k! ✔️ Pode banhar na água do mar. ✔️ Banho piscina. ✔️ Design premium. |  | [ver](https://www.facebook.com/ads/library/?id=1368124935530972) |
| 180 |  | Isabela Batista - Coloração Pessoal | Saber combinar é estratégia! Aprenda e já salva esse vídeo para não esquecer as dicas!✨ #e | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1211198184277229) |
| 529 | 2 | anaborgesconsultoria | Se você é de Curitiba e quer descobrir quais cores realçam a sua beleza natural, a coloraç |  | [ver](https://www.facebook.com/ads/library/?id=560204317123338) |
| 39 |  | Moreflex | Você sabe o verdadeiro impacto da baixa calibragem? Neste vídeo, Bruno da Pneuflex mostra  | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1488128933119539) |
| 94 |  | Arvoredo - Paisagismo e Reflorestamento | 🌳 Árvores acima de 2 metros para projetos de paisagismo e arborização Hoje apresentamos a | instagram.com | [ver](https://www.facebook.com/ads/library/?id=865259206350326) |
| 147 |  | Aline Garoncio Academy |  | instagram.com | [ver](https://www.facebook.com/ads/library/?id=2774112496291107) |
| 89 |  | Aline Garoncio Academy | Se precisa aprender a loira de tinta global e a loira de tinta híbrida comente EU QUERO e  | instagram.com | [ver](https://www.facebook.com/ads/library/?id=4404848146419766) |

### 16. yoga facial (~66 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=yoga%20facial&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 14 | 3 | Marasca Samui | Wellness & Recovery by the Sea 🌿 This December, embrace a slower p | marasca.live | [ver](https://www.facebook.com/ads/library/?id=947348181770916) |
| 26 |  | Sadie Nardini | 🫠🫣Face Aging Fast? Here's how to prevent or reverse accelerated aging 👉🏻 and it's 57%  | agefiercely.com | [ver](https://www.facebook.com/ads/library/?id=1826153931708088) |
| 26 |  | Sadie Nardini | 🫠Stop face & neck sagging at the source! Here's how to prevent or reverse that saggy, wri | agefiercely.com | [ver](https://www.facebook.com/ads/library/?id=1626011885770282) |
| 37 |  | Saldanha.Imóveis | ✨ VIVA O MELHOR DE JURERÊ EM UM LOFT GARDEN EXCLUSIVO! ✨Procurando o lugar perfeito para m | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1054055840580716) |
| 18 |  | Passeio Beira Rio | Outubro chegou trazendo uma agenda daquelas para colocar o Passeio Beira Rio no seu roteir | instagram.com | [ver](https://www.facebook.com/ads/library/?id=4380823675502888) |
| 26 |  | Sadie Nardini | 🫠Stop face & neck sagging at the source! FLASH SALE!⚡️👇🏻 Here's how to prevent or rever | agefiercely.com | [ver](https://www.facebook.com/ads/library/?id=27499654833043925) |
| 17 |  | Carmelo Resort & Spa | Carmelo Resort & Spa 🌿 Venha aproveitar suas férias de verão em família com refeições inc |  | [ver](https://www.facebook.com/ads/library/?id=1396958125923671) |
| 12 | 2 | Clínica Sathya Suzano | Outubro Rosa na Sathya 🎀 Cuidar de você é o melhor cuidado preventivo que existe — e nest | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=39144388848508837) |
| 40 |  | Instituto Sheng | If you're passing through Foz do Iguaçu and need a break to relax your body after long tou | institutosheng.com.br | [ver](https://www.facebook.com/ads/library/?id=1642350010615421) |
| 3 |  | Maahara com Dra. Ísis Weber | No Maahara em Ivoti, cada detalhe foi pensado para proporcionar uma experiência integrada  | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1766954737855500) |
| 12 | 2 | Clínica Sathya | Outubro Rosa na Sathya 🎀 Cuidar de você é o melhor cuidado preventivo que existe — e nest | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=4325683614314918) |
| 4 | 2 | Move Flow Intro | Os trilhos anatômicos são mapas. Mas mapa nenhum serve se você não souber interpretar o ca |  | [ver](https://www.facebook.com/ads/library/?id=2179658412763205) |
| 17 |  | Carmelo Resort & Spa | Carmelo Resort & Spa 🌿 Ao reservar 3 noites, a 4ª noite é GRÁTIS! ✨ Inclui: - Alojamento  |  | [ver](https://www.facebook.com/ads/library/?id=1617812609755813) |
| 2 | 6 | Centro Viveka - Rolfing Estrutural e Mov | A maioria das formações de yoga ensina postura — não ensina o que fazer quando o corpo do  |  | [ver](https://www.facebook.com/ads/library/?id=1606176030995308) |
| 14 |  | Faceplastica by Dr. Ales | "Jowls appeared, a double chin too, and my weight is the same as five years ago." If that  |  | [ver](https://www.facebook.com/ads/library/?id=1105971145724417) |
| 4 |  | Unica Terapias | Nova turma de Estética Facial Integrativa em Santos ✨ Uma formação presencial para quem qu |  | [ver](https://www.facebook.com/ads/library/?id=2236449603962145) |
|  |  | Fer Perlatti | Você cuida de tudo. Mas anda sem energia, com oscilações de humor, com a barriga estufada, | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=2172313656650931) |
| 3 |  | Maahara com Biomédica Esteta - Deise Soa | No Maahara em Ivoti, cada detalhe foi pensado para proporcionar uma experiência integrada  |  | [ver](https://www.facebook.com/ads/library/?id=4558131067847150) |
| 3 | 2 | WebHoje Holística | ✨ Descubra técnicas de Yoga Facial e aprenda uma rotina de exercícios para o rosto. Nesta  | cursodeyogaalfa.com | [ver](https://www.facebook.com/ads/library/?id=4597143277239973) |
| 1 |  | Couto.PC | Se você quer notebook premium de verdade, para de perder tempo com opção comum. ⚡💻 Esse L | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1822810612247224) |

### 17. unhas em casa (~2.900 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=unhas%20em%20casa&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 45 | 19 | Naturopata.arthur.rios | A micose de unha e a frieira são causados por fungos que podem se espalhar para outras par |  | [ver](https://www.facebook.com/ads/library/?id=4584459358455445) |
| 21 |  | Always Fit - Saúde, Longevidade e Autoes | Cuidar de você também pode começar pelas pequenas escolhas do dia a dia. ✨ Na Always Fit,  |  | [ver](https://www.facebook.com/ads/library/?id=1099908719195369) |
| 172 | 5 | Cora | Adeus Alicate. Olá Cutículas Perfeitas. |  | [ver](https://www.facebook.com/ads/library/?id=2158314624927905) |
| 95 |  | Fabiana Rodrigues | Oportunidade unica | fabianajunyarodriguesnails.com | [ver](https://www.facebook.com/ads/library/?id=1355825576504554) |
| 123 |  | Grazy Coelho | Você trabalha com unhas e quer levar sua esmaltação em gel para outro nível? Meu curso te  | pv.grazielycoelho.com.br | [ver](https://www.facebook.com/ads/library/?id=906079012523664) |
| 30 |  | By Pamella | 💅✨ Sua chance de pagar R$99,99 está acabando! Finalize agora e ainda ganhe 1 Colágeno GRÁ | www.happyhair.com.br | [ver](https://www.facebook.com/ads/library/?id=2171388580109434) |
| 132 | 2 | Blant Cosméticos | 💅 Unhas fracas, que descamam ou quebram à toa? A Blindagem das Unhas da Blant é o tratame |  | [ver](https://www.facebook.com/ads/library/?id=1004005209211914) |
| 340 | 4 | Mimers | Mês de Black Friday Mimers / Descontos Nunca Antes Vistos em Todo o Site! Nossos gatos não |  | [ver](https://www.facebook.com/ads/library/?id=1805324557011399) |
| 143 |  | Instituto Embelleze São José dos Campos | O Instituto Embelleze São José dos Campos TÁ DE CASA NOVA! | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=970782092539023) |
| 17 |  | ISSO É SER GATO com Shopee | Eu estou apaixonada nessa maquininha 😍 | s.shopee.com.br | [ver](https://www.facebook.com/ads/library/?id=963604449501722) |
| 27 |  | Danielle Bartoly | Compartilhe conhecimento. Formação de peritos: @instituto_db_pericias #periciacriminal #pe | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1620295339540698) |
| 36 |  | Amor Online | 💖OLHA ESSE PRODUTO🤌🏻 💬Comenta QUERO que mando o link na mesma hora.✨ Gosta economizar? | s.shopee.com.br | [ver](https://www.facebook.com/ads/library/?id=28450534471298691) |
| 137 |  | Importados São Mateus | 🔥 LOJA DE R$ 5,99 QUE TÁ VIRALIZANDO EM SÃO MATEUS! Sério… é mais barato que muita coisa  | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1567422628265424) |
| 56 |  | Casa das Unhas Gravataí | 🚨 ATENÇÃO CANOAS 🚨 Muita gente ainda não sabe… mas a loja mais COMPLETA de unhas também  | www.instagram.com | [ver](https://www.facebook.com/ads/library/?id=1432019095478747) |
| 31 | 3 | Marluce Oliveira |  |  | [ver](https://www.facebook.com/ads/library/?id=2261140688060650) |
| 416 |  | Studio Marcela Souza 23 | ✨ Suas clientes estão pedindo unhas impecáveis? No meu Curso de Molde F1, você aprende: ✅  | api.whatsapp.com | [ver](https://www.facebook.com/ads/library/?id=1919550548889563) |
| 79 |  | Importados São Miguel | Grande Inauguração da loja mais BARATA de São Miguel 💖 QUARTA - FEIRA 05/08 às 9:00. Qual | instagram.com | [ver](https://www.facebook.com/ads/library/?id=2263269621152976) |
| 40 | 2 | Achei e asmei | Gente, eu tô sem chão… Paguei nada menos que R$350 nessa unha. Fiquei quase 3 horas na cad | s.shopee.com.br | [ver](https://www.facebook.com/ads/library/?id=2608753672919554) |
| 123 |  | Pink Party | Sabe o que é melhor⁉️É uma opção de festa com ótimo custo x benefício, ainda mais com o no |  | [ver](https://www.facebook.com/ads/library/?id=1003967195341814) |
| 38 | 4 | Thássia Piezzaroli Microclean | Seja uma especialista em REMOÇÃO DE ESTRIAS Comece do zero e conquiste seus primeiros R$ 5 |  | [ver](https://www.facebook.com/ads/library/?id=1802453597550623) |

### 18. guia skincare (~210 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=guia%20skincare&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 140 |  | Jardel Edebran com Principia Skincare Pr | GUIA 2026 de @principiaskincare pra vocês! CUPOM: JARDEL Já comenta qual seu produto favor | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1318705503167712) |
| 158 |  | Jardel Edebran com Principia Skincare Pr | Sua pele fica ressecada no inverno? Vem que eu fiz um guia de hidratantes com PRINCIPIA pa | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1460274945277544) |
| 81 |  | Skin Army com Jardel Edebran | 🇰🇷 Comente QUERO que eu te envio os links dos toner pads originais da Medicube! Escolher | s.shopee.com.br | [ver](https://www.facebook.com/ads/library/?id=1404011021608921) |
| 73 |  | Enferya Resumos | Você já percebeu como o Microtox vem ganhando cada vez mais destaque na harmonização facia | pay.hotmart.com | [ver](https://www.facebook.com/ads/library/?id=4494977837441207) |
| 18 | 2 | Lojas Alia | POV: você abriu o guia da rotina perfeita da ALIA ✨ Do skincare ao acessório, só os essenc | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1625546779234036) |
| 49 |  | Miguel SILVA - Skincare com Principia Sk | Guia definitivo de Skin Care com Principia Cupons de Desconto: * MIGUEL → 10% OFF (em kits | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1616641683208694) |
| 38 |  | Clínica Estética- Thayna Ribeiro | Quer acertar de vez no seu skincare? Salve esse guia! 📌 Escolher os ativos certos faz tod | www.instagram.com | [ver](https://www.facebook.com/ads/library/?id=1808034060610812) |
| 67 |  | dranselmo.oliveira | Se você ou alguém da sua família convive com dermatite atópica, salve esse post para lembr | instagram.com | [ver](https://www.facebook.com/ads/library/?id=2009417166374996) |
| 215 |  | IYS Cosmetics | Por trás de cada fórmula da IYS existe uma intenção: unir ciência de ponta ao cuidado afet | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1460215782876658) |
| 47 |  | Júlia Mateus | Skincare não precisa ser complicado. Mais importante do que ter muitos produtos é entender |  | [ver](https://www.facebook.com/ads/library/?id=2130495761170280) |
| 23 |  | GestarOrganics | O autocuidado faz toda a diferença durante a gestação e também no pós-parto. 💚 Uma rotina | gestarorganics.com | [ver](https://www.facebook.com/ads/library/?id=2515152392286526) |
| 17 | 3 | Melancita.make | ✨ SKINCARE DE MILHÕES… POR SÓ R$10! ✨ Chegaram na Melancita os séruns da Dermachem para mo | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1064402349752092) |
| 154 |  | Jardel Edebran com Principia Skincare Pr | Sabia que existem mais de um TIPO de PORO na pele? Todo mundo acha que poro é tudo igual!  | www.principiaskin.com | [ver](https://www.facebook.com/ads/library/?id=1857385898575836) |
| 17 |  | Jardel Edebran com Sallve | Publi / Não existe um único protetor solar ideal para todo mundo. A @sallve tem opções par | www.sallve.com.br | [ver](https://www.facebook.com/ads/library/?id=1658617792563915) |
| 25 | 2 | Michelle Carter - Skincare Expert | See how quickly you can achieve your skincare goals with Lóvi 😍 | interview.lovi.care | [ver](https://www.facebook.com/ads/library/?id=2166055194124812) |
| 136 |  | dratalitateixeira | Guia prático de como usar seu VITACID sem irritar a sua pele. Salva esse post para não err | instagram.com | [ver](https://www.facebook.com/ads/library/?id=1500600688531660) |
| 24 | 5 | Escola da Pele 4 | Mais de 50 ativos de skincare com resultado comprovado. Abertos, explicados e prontos para | pg.escoladapele.com.br | [ver](https://www.facebook.com/ads/library/?id=1843575960134612) |
| 6 | 2 | Lia Choi Eun-ha 리아 최 은하 - Korean Skincar | ✨ ¿Cansada de gastar demasiado en productos que no funcionan para tu piel? 🧴 Haz el quiz  |  | [ver](https://www.facebook.com/ads/library/?id=1109228118167970) |
| 3 | 2 | Evelyn Cho Min-jung 샬롯조 K Beauty Co | Your skin deserves more than guesswork ✨ Tell Lovi about your skin, and get a personalized | interview.lovi.care | [ver](https://www.facebook.com/ads/library/?id=1965340724839438) |
| 26 |  | Dr. Alberto Cordeiro | A área dos olhos não precisa de uma rotina complicada. Precisa de cuidado, constância e es | instagram.com | [ver](https://www.facebook.com/ads/library/?id=2604927713270270) |

### 19. hotmart pele (~150 resultados)

[Abrir a busca](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=hotmart%20pele&search_type=keyword_unordered&sort_data%5Bmode%5D=total_impressions&sort_data%5Bdirection%5D=desc)

| Dias | Cópias | Anunciante | Texto | Domínio | Anúncio |
|---|---|---|---|---|---|
| 73 |  | Enferya Resumos | Você já percebeu como o Microtox vem ganhando cada vez mais destaque na harmonização facia | pay.hotmart.com | [ver](https://www.facebook.com/ads/library/?id=4494977837441207) |
| 34 |  | Dra Ana Corso - Especialista em Toxina B | Domine o raciocínio clínico por trás de uma aplicação Full Face perfeita que está transfor | pay.hotmart.com | [ver](https://www.facebook.com/ads/library/?id=3106064026255148) |
| 124 |  | Enferya Resumos | Domine os principais fundamentos do Microagulhamento Facial! O microagulhamento é um dos p | pay.hotmart.com | [ver](https://www.facebook.com/ads/library/?id=1454818786674873) |
| 123 |  | Enferya Resumos | Quer entender o Microagulhamento Facial de forma clara e organizada? Criamos um guia compl | pay.hotmart.com | [ver](https://www.facebook.com/ads/library/?id=1722648838973696) |
| 286 | 2 | Tainara Reis |  |  | [ver](https://www.facebook.com/ads/library/?id=25658489087175628) |
| 131 | 2 | Rodrigo Pedro • Salão Do Pelé | Fabrica de Loiros com Rodrigo Pedro ✨🚀 Nesse curso online além de apresentar técnicas de  |  | [ver](https://www.facebook.com/ads/library/?id=1673100520613349) |
| 102 |  | Alex Bernardo Fotografia | Você tira uma foto incrível. Abre o Lightroom. E fica olhando pra tela sem saber o que faz | alexbernardofotografia.hotmart.host | [ver](https://www.facebook.com/ads/library/?id=1291220466181955) |
| 72 |  | Enferya Resumos | O Microtox está conquistando espaço na harmonização facial por oferecer uma abordagem volt | pay.hotmart.com | [ver](https://www.facebook.com/ads/library/?id=1735700687505294) |
| 8 |  | Protocolo Tallow |  | hotmart.com | [ver](https://www.facebook.com/ads/library/?id=1095823213167406) |
| 10 |  | Dr. Jacintho Sanchez - Cirurgião Plástic | Muitas mulheres acreditam que, depois de alguns anos da cesárea, perderam a chance de faze | pay.hotmart.com | [ver](https://www.facebook.com/ads/library/?id=1595376575669050) |
| 35 |  | Dra. Beatriz H. Biomedicina | Quer começar na estética e não sabe por onde? O Limpeza de Pele do Zero é o primeiro passo | pay.hotmart.com | [ver](https://www.facebook.com/ads/library/?id=2309728506233160) |
|  |  | Autocuidado Lucrativo | Se você acha que autocuidado é só "produto bonito"… você tá deixando dinheiro na mesa. O q | go.hotmart.com | [ver](https://www.facebook.com/ads/library/?id=2208927436544101) |
| 70 |  | Marketing para profissionais da Beleza | Copie e cole esse novo método que fez mais de 45 mil alunas da área da estética e beleza c | barrilzeraa.hotmart.host | [ver](https://www.facebook.com/ads/library/?id=3094126777459595) |
| 60 |  | Leandro Ladeira |  |  | [ver](https://www.facebook.com/ads/library/?id=903681939048337) |
| 89 |  | Cinara Pavesi - Jornada dos Aromas | Muita gente se preocupa com a cera e a essência, mas esquece da própria segurança. O uso d | jornadadosaromas.com.br | [ver](https://www.facebook.com/ads/library/?id=1369486095151449) |
| 13 |  | Biografia da Arte | O Biografia da Arte é uma plataforma completa para quem quer aprender mais sobre Arte! | go.hotmart.com | [ver](https://www.facebook.com/ads/library/?id=1612838630224667) |
| 141 | 3 | parademinasdestribuidor |  |  | [ver](https://www.facebook.com/ads/library/?id=1037288595496232) |
| 12 |  | Enferya Resumos | Microagulhamento Facial: você realmente domina os principais conceitos da técnica? Anatomi | pay.hotmart.com | [ver](https://www.facebook.com/ads/library/?id=1978180819972535) |
| 141 | 10 | parademinasdestribuidor | Curso no perfil como ter uma casa de ração: quatro carne R$115 por R$90 chegou hoje novinh |  | [ver](https://www.facebook.com/ads/library/?id=1701126711222040) |
| 17 |  | Sociedade Gnóstica | Existe um jeito de você viver na própria pele o que passou anos lendo sobre projeção astra | sgi.org.br | [ver](https://www.facebook.com/ads/library/?id=1181058647921086) |
