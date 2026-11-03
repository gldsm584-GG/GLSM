# Como subir a campanha do Natal Mágico no Meta

Escrito em 2026-11-02, com a página "Natal Mágico" já criada. A ordem importa: sem o Pixel ligado, o Meta
não vê as vendas e otimiza no escuro, como aconteceu no começo das frutíferas (uma venda Pix nunca foi
atribuída).

1. Página e conta de anúncios prontas
2. Pixel novo "Natal Mágico"
3. Pixel na Wiapy
4. Pixel na página de venda (Claude)
5. Compra de teste
6. Campanha
7. Os primeiros dias

Conta, dinheiro e publicação são do Gustavo. Os textos e as imagens estão em `textos-dos-anuncios.md` e
`fotos/`.

---

## 1. Página e conta de anúncios prontas

O Natal Mágico tem portfólio e conta de anúncios próprios, criados pelo Gustavo em 2026-11-02: portfólio
empresarial **Natal Mágico** (ID 1143226331510175) e conta de anúncios **Natal Magico**, ID
1673299994454815. A conta das frutíferas (act=1318830253601896) fica só para as frutíferas.

Conferido na BM em 2026-11-02: página e conta dentro do portfólio, Pixel ligado à conta e nome do
portfólio corrigido (era "Nalta Magico"). **Falta o cartão** na conta nova.

- **Página:** foto de perfil, capa, botão "Comprar agora" e os 5 posts de `pagina-do-facebook.md`, com
  o 1º fixado. Quem toca no nome do anúncio cai na página: vazia, ela passa desconfiança.
- **Nome do portfólio:** engrenagem ao lado de "Nalta Magico" (ou Configurações do portfólio →
  Informações do portfólio) → trocar para **Natal Mágico**.
- **Página no portfólio:** Configurações do portfólio → Contas → **Páginas** → Adicionar → Natal Mágico.
  Sem isso ela pode não aparecer no campo Identidade do anúncio.
- **Forma de pagamento na conta nova:** Gerenciador de Anúncios, conta Natal Magico → **Cobrança e
  pagamentos** → adicionar o cartão. A conta das frutíferas tem o dela; a nova começa sem nenhum.

## 2. Pixel novo "Natal Mágico"

**Criado em 2026-11-02: ID 991211670703665.**

Usar um Pixel só para o Natal Mágico, não o das frutíferas (1762012128208646). O Meta aprende com as
compras do Pixel: misturar quem compra ebook de planta com quem compra kit de Natal confunde a
otimização e o relatório.

1. Abra o **Gerenciador de Eventos** (business.facebook.com/events_manager). No alto, à esquerda,
   escolha o portfólio **Natal Mágico**.
2. **Conectar fontes de dados** (o botão verde **+**) → **Web** → nome **Natal Mágico** → **Criar**.
3. Se ele oferecer instalar no site ou usar um parceiro, feche: a Wiapy e a página de venda recebem o
   código separado.
4. Copie o **ID do conjunto de dados** (número de 15 ou 16 dígitos, embaixo do nome do Pixel e em
   Configurações) e mande para o Claude. Não confundir com o ID da conta de anúncios
   (1673299994454815), que aparece no seletor de contas.
5. Ligue o Pixel à conta de anúncios, senão ele não aparece na hora de criar o conjunto: no
   Gerenciador de Eventos, Configurações do Pixel → **Contas de anúncios conectadas** (ou, no
   portfólio, Fontes de dados → Conjuntos de dados → Natal Mágico → **Adicionar ativos**) → a conta
   **Natal Magico**.
6. Nas Configurações do Pixel, em **API de Conversões**, clique em **Gerar token de acesso** e
   guarde o token. Só use se a Wiapy tiver um campo para ele (parte 3).

## 3. Pixel na Wiapy

**Feito em 2026-11-02** (pelo Claude, no navegador do app, a pedido do Gustavo). O Pixel fica no menu
**Integrações → Facebook Ads** do painel (wiapy.com/producer/integrations), e não nas configurações do
checkout como dizia a ajuda da Wiapy. A integração salva:

- Nome: `Pixel Natal Mágico`
- Produto: Natal Mágico (checkout 6ae7abc92da3da6ee2ed677b), não "Todos os produtos"
- ID do Pixel: 991211670703665
- Eventos para enviar: só **Pagamento aprovado** (vira a compra no Meta). "Pagamento pendente" fica
  desligado para não contar Pix gerado e não pago, igual na Kiwify das frutíferas
- Token da API de Conversões: colado pelo Gustavo em 2026-11-02 (Integrações → Minhas integrações →
  três pontinhos de "Pixel Natal Mágico" → Editar → Token). Nas frutíferas, sem o token o Meta perdeu
  uma venda Pix. No Gerenciador de Eventos a API de Conversões aparece como "Conexão pendente" até a
  primeira compra

O formulário não tem opção de InitiateCheckout: se ele não aparecer na compra de teste, tudo bem, o que
importa para a campanha é a compra.

## 4. Pixel na página de venda (Claude)

Com o ID, o Claude põe na `pagina-de-venda/index.html` o mesmo bloco da página das frutíferas
(`PageView`) e republica na Vercel. A página já repassa `fbclid` e `utm_*` para o checkout.

## 5. Compra de teste

1. No celular, abra https://natal-magico-gamma.vercel.app → botão de compra → marque os 2 extras →
   pague no Pix (R$ 30,60). O dinheiro volta para o seu saldo na Wiapy, menos a taxa.
2. Confira o e-mail: precisam chegar os 3 PDFs (Natal Mágico, caixinhas e kit do Papai Noel).
3. Gerenciador de Eventos → Natal Mágico: precisam aparecer **PageView** e **Purchase**
   (InitiateCheckout, se aparecer, é bônus). Pode levar uns 20 minutos para aparecer na Visão geral.

Se o Purchase não aparecer, não suba a campanha: mande um print para o Claude.

## 6. Campanha

Gerenciador de Anúncios → conta **Natal Magico** (1673299994454815) → **+ Criar**.

### Campanha

| Campo | O que colocar |
|---|---|
| Objetivo | **Vendas** |
| Nome | `Natal Mágico - Vendas` |
| Orçamento | **da campanha (Advantage+)**, sugestão R$ 20/dia (o valor é decisão do Gustavo) |
| Início | o dia seguinte à compra de teste, às 8h |
| Término | 24/12 (produto de Natal: não fica ligado esquecido em janeiro) |

### Conjunto de anúncios

| Campo | O que colocar |
|---|---|
| Nome | `Brasil aberto` |
| Local da conversão | **Site** |
| Conjunto de dados (Pixel) | **Natal Mágico** |
| Evento | **Compra** |
| Público | **Advantage+**, Brasil, sem interesses. Nas frutíferas, o público com interesses deixou o anúncio caro (CPM ~R$ 78) |
| Posicionamentos | Advantage+, mas **desmarcar a Audience Network** e desligar **"Permitir gasto limitado em posicionamentos excluídos"**. Nas frutíferas, 96% dos cliques vieram dela (anúncio em jogo de celular) e nenhum comprou |

### Anúncios: 5, um por imagem, no mesmo conjunto

Um anúncio por imagem (e não as 5 juntas num só) para o relatório mostrar qual vende e dar para pausar
o pior pelo nome.

| Nome do anúncio | Imagem |
|---|---|
| `04 so imprimir` | `fotos/anuncio-04-so-imprimir.png` |
| `05 pinte recorte brinque` | `fotos/anuncio-05-pinte-recorte-brinque.png` |
| `06 45 recursos` | `fotos/anuncio-06-45-recursos.png` |
| `08 menos tela` | `fotos/anuncio-08-menos-tela.png` |
| `09 ferias` | `fotos/anuncio-09-ferias.png` |

Monte o primeiro, depois use **Duplicar** 4 vezes e troque só o nome e a imagem.

| Campo | O que colocar |
|---|---|
| Identidade | Página **Natal Mágico**; no Instagram, **Usar a Página do Facebook** |
| Formato | **Imagem única** |
| Texto principal | Versão A e Versão B (botão "Adicionar opção de texto") |
| Título | os 3 títulos |
| Descrição | `PDF · R$ 19,90 · chega no e-mail` |
| Chamada para ação | **Comprar agora** |
| URL do site | `https://natal-magico-gamma.vercel.app` |
| Parâmetros de URL | `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}` |
| Aprimoramentos de criativo Advantage+ | **desligar os que mexem na imagem e no texto** (expandir imagem, gerar fundo, sobreposições, retoques, música, animação, ajustes de texto). As peças já têm texto e preço escritos na arte; o Meta pode cortar, redesenhar ou reescrever o texto |
| Rastreamento | **Eventos do site** ligado, com o conjunto de dados Natal Mágico |

Confira o resumo e clique em **Publicar**. O Meta revisa os anúncios antes de rodar (costuma levar de
minutos a algumas horas).

## 7. Os primeiros dias

- **Não editar nada nos 3 primeiros dias.** Cada edição grande (orçamento, público, criativo) reinicia
  o aprendizado do Meta.
- **Conta do empate:** no cartão sobram ~R$ 17,42 de cada venda de R$ 19,90 (taxa da Wiapy de R$ 1,49 +
  4,99%), e ~R$ 27,58 quando a pessoa leva os 2 extras. A venda empata se custar até ~R$ 17 no anúncio.
- **Com ~R$ 60 gastos (3 dias),** mande para o Claude um print no nível **Anúncios** com as colunas
  impressões, cliques no link, CTR (link), CPC (link), CPM, finalizações de compra iniciadas, compras e
  custo por compra, e o número de vendas da Wiapy (`/relatorio-ads`).
- **Combine antes um limite de perda.** Nas frutíferas o plano foi de R$ 100: chegou nele sem venda,
  pausa e mexe na página ou nos criativos antes de gastar mais.
- A campanha das frutíferas está desligada e fica em outra conta de anúncios. Se for religada e as duas
  contas usarem o mesmo cartão, os gastos se somam no limite dele.
- Conta de anúncios nova costuma começar com limite de gasto diário baixo, que o Meta sobe sozinho conforme
  as cobranças passam. Se a campanha travar em "limite de gasto da conta", é isso.
