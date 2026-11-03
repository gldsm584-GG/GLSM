# Como subir a campanha do Natal Mágico no Meta

Escrito em 2026-11-02, com a página "Natal Mágico" já criada. A ordem importa: sem o Pixel ligado, o Meta
não vê as vendas e otimiza no escuro, como aconteceu no começo das frutíferas (uma venda Pix nunca foi
atribuída).

1. Página e conta de anúncios prontas
2. Pixel novo "Natal Mágico"
3. Pixel na Wiapy
4. Pixel na página de venda (Claude)
5. Utmify
6. Compra de teste
7. Campanha
8. Os primeiros dias

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

## 5. Utmify

**Ligada em 2026-11-03.** A Utmify junta as vendas da Wiapy com o gasto do Meta e mostra o lucro de
cada anúncio, inclusive das vendas que o Pixel não atribui (como a venda Pix perdida nas frutíferas).

- **Credencial:** Utmify → Integrações → Webhooks → Credenciais de API → `Wiapy Natal Mágico`, criada
  pelo Gustavo. O token só aparece na hora de criar; se precisar dele de novo, crie outra credencial.
- **Na Wiapy:** Integrações → Utmify, integração `Wiapy Natal Mágico`: produto Natal Mágico, o token
  da credencial e os eventos Pagamento pendente, aprovado, estornado e chargeback. Aqui o pendente
  pode ficar ligado: na Utmify ele só mostra o Pix gerado e não pago, e não vai para o Meta. O Claude
  conferiu que o token é o mesmo nas duas.
- **Conta de anúncios:** Utmify → Integrações → Anúncios → Meta Ads, perfil Gustavo Luis: só a
  **Natal Magico** ligada. Tinha ficado ligada uma conta "Gustavo Luis" desabilitada, e o Claude
  trocou com OK do Gustavo. Na troca, a Natal Magico desligou sozinha uma vez, porque o plano
  gratuito aceita só 1 conta de anúncios: depois de mexer, recarregue a página e confira.
- **Plano:** gratuito, expira em 01/01/2027 (cobre a campanha até 24/12). Limites: 1 conta de
  anúncios, 1 dashboard, 1 webhook e 1 Pixel. A Assinatura mostra também um "0 / 30" sem nome, que
  pode ser um limite de vendas: conferir quando as vendas começarem.
- **Taxas** (menu Taxas): vazio em 2026-11-03. Depois da compra de teste, veja em Pedidos se a
  comissão já vem sem a taxa da Wiapy. Se vier com o valor cheio, adicione a taxa da Wiapy (4,99% +
  R$ 1,49 sobre o valor de faturamento); se já vier sem, não adicione, senão a taxa conta duas vezes.
  O imposto sobre o gasto no Meta só entra se a fatura do Meta cobrar imposto.
- **Assistente de configuração:** terminado pelo Claude em 2026-11-03. O aviso "Configuração
  incompleta" sumiu.
- **Script de UTMs:** não precisa, a página já repassa `utm_*` e `fbclid` para o checkout (parte 4).
  No assistente, ficou marcado "Já instalei o script de UTMs".
- **Pixel da Utmify:** não usar (no assistente, ficou "Vou configurar pixels depois"). A Wiapy já manda a compra para o Meta com o
  token da API de Conversões; um segundo Pixel contaria cada venda duas vezes.
- **UTMs:** os parâmetros de URL dos anúncios (parte 7) levam o nome e o ID da campanha, do conjunto
  e do anúncio, que é como a Utmify liga cada venda ao anúncio.

## 6. Compra de teste

1. No celular, abra https://natal-magico-gamma.vercel.app/?utm_source=FB&utm_campaign=teste|1&cid=13706891685
   → botão de compra → marque os 2 extras → pague no Pix (R$ 30,60). O dinheiro volta para o seu saldo na
   Wiapy, menos a taxa.
2. Confira o e-mail: precisam chegar os 3 PDFs (Natal Mágico, caixinhas e kit do Papai Noel).
3. Gerenciador de Eventos → Natal Mágico: precisam aparecer **PageView** e **Purchase**
   (InitiateCheckout, se aparecer, é bônus). Pode levar uns 20 minutos para aparecer na Visão geral.
4. Utmify → **Pedidos**: a venda tem que aparecer com a campanha `teste`.

Se o Purchase não aparecer, não suba a campanha: mande um print para o Claude. Se só a Utmify falhar,
a campanha pode subir, mas mande o print também.

## 7. Campanha

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
| `01 so imprimir` | `fotos/anuncio-01-so-imprimir.png` |
| `02 pinte recorte brinque` | `fotos/anuncio-02-pinte-recorte-brinque.png` |
| `03 45 recursos` | `fotos/anuncio-03-45-recursos.png` |
| `04 menos tela` | `fotos/anuncio-04-menos-tela.png` |
| `05 ferias` | `fotos/anuncio-05-ferias.png` |

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
| Parâmetros de URL | o texto do bloco logo abaixo da tabela |
| Aprimoramentos de criativo Advantage+ | **desligar os que mexem na imagem e no texto** (expandir imagem, gerar fundo, sobreposições, retoques, música, animação, ajustes de texto). As peças já têm texto e preço escritos na arte; o Meta pode cortar, redesenhar ou reescrever o texto |
| Rastreamento | **Eventos do site** ligado, com o conjunto de dados Natal Mágico |

**Parâmetros de URL** (em Rastreamento; colar inteiro, sem `?` no começo e sem mexer no que está
entre `{{ }}`, que o Meta troca pelo nome e pelo ID reais). É o "Código de UTMs do Facebook", opção
**Outra**, de Utmify → Integrações → UTMs, copiado em 2026-11-03; o `cid` no fim é o da conta Utmify:

```
utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}&cid=13706891685
```

É o mesmo texto nos 5 anúncios; o **Duplicar** já copia, mas confira. Na prévia, o endereço que abre
tem que terminar com `?utm_source=FB&utm_campaign=Natal Mágico - Vendas|...`. Depois de publicar,
rode o diagnóstico da Utmify (Integrações → UTMs, ou o passo "UTMs da Meta" do assistente, conta
Natal Magico): ele aponta anúncio sem o código.

Confira o resumo e clique em **Publicar**. O Meta revisa os anúncios antes de rodar (costuma levar de
minutos a algumas horas).

## 8. Os primeiros dias

- **Não editar nada nos 3 primeiros dias.** Cada edição grande (orçamento, público, criativo) reinicia
  o aprendizado do Meta.
- **Conta do empate:** no cartão sobram ~R$ 17,42 de cada venda de R$ 19,90 (taxa da Wiapy de R$ 1,49 +
  4,99%), e ~R$ 27,58 quando a pessoa leva os 2 extras. A venda empata se custar até ~R$ 17 no anúncio.
- **Com ~R$ 60 gastos (3 dias),** mande para o Claude um print no nível **Anúncios** com as colunas
  impressões, cliques no link, CTR (link), CPC (link), CPM, finalizações de compra iniciadas, compras e
  custo por compra, e o número de vendas da Wiapy (`/relatorio-ads`). Um print da Utmify no nível
  anúncio ajuda também: ela mostra as vendas que o Pixel não atribuiu.
- **Combine antes um limite de perda.** Nas frutíferas o plano foi de R$ 100: chegou nele sem venda,
  pausa e mexe na página ou nos criativos antes de gastar mais.
- A campanha das frutíferas está desligada e fica em outra conta de anúncios. Se for religada e as duas
  contas usarem o mesmo cartão, os gastos se somam no limite dele.
- Conta de anúncios nova costuma começar com limite de gasto diário baixo, que o Meta sobe sozinho conforme
  as cobranças passam. Se a campanha travar em "limite de gasto da conta", é isso.
