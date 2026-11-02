---
periodo_inicio: 2026-10-26
periodo_fim: 2026-10-28
investimento_total: 72.49
conversoes_total: 2
cpa_medio: 36.25
canais: [meta-ads]
---

# Relatório de Ads — 26/10 a 28/10 (3 dias de teste)

Ebook "Sua Frutífera Vai Dar Fruto" (R$ 20, sobram R$ 15,71 por venda na Kiwify).
Primeira leitura: serve de base para comparar com as próximas.
Fonte: print do Gerenciador de Anúncios (nível de campanha), enviado pelo Gustavo em 2026-10-29.

## Resumo executivo

**Investimento:** R$ 72,49
**Vendas reais (Kiwify):** 2, R$ 31,42 líquidos. O Meta contou só 1 (R$ 15,71): a venda de 2026-10-28 não foi atribuída
**Custo por venda real:** R$ 36,25 (o ponto de empate é R$ 15,71: está 2,3 vezes acima)
**Resultado real:** -R$ 41,07 (ROAS real 0,43; o empate é 1,0, porque o valor já é o líquido da Kiwify)

A tabela abaixo é o que o Meta mostra (1 compra), não o resultado real.

| Campanha | Status | Orçamento | Gasto | Finaliz. iniciadas | Custo/finaliz. | Compras | Custo/compra | Valor | ROAS | Grana no bolso |
|---|---|---|---|---|---|---|---|---|---|---|
| Conversão-frutifera 1- $14 — segmentada | ativa | R$ 14/dia | R$ 72,49 | 2 | R$ 36,24 | 1 | R$ 72,49 | R$ 15,71 | 0,22 | -R$ 56,78 |
| Conversão-frutifera 1- $20 | desligada | R$ 20/dia | R$ 0,00 | — | — | — | — | — | — | — |

**Headline:** cada R$ 1 no Meta voltou R$ 0,43 de verdade (o Meta mostra R$ 0,22 porque perdeu uma
venda). Para empatar, cada venda precisa sair 2,3 vezes mais barata. O Meta viu 2 finalizações e
1 compra; com a venda que ele não viu, a contagem de finalizações também pode estar incompleta.

## O que o print não mostra

Faltam impressões, cliques no link, CTR, CPC, CPM, frequência e visualizações da página de destino,
e a visão por anúncio. Sem isso não dá para saber se o problema é o anúncio (pouca gente clica) ou
a página (muita gente clica e não compra). A conta de empate:

- Custo por compra = CPC ÷ taxa de conversão da página. Com CPC de R$ 0,50, a página precisa
  converter 3,2% dos cliques em venda para empatar.

## Alertas

- 🔴 **Prejuízo:** R$ 72,49 para 2 vendas reais (R$ 31,42 líquidos), -R$ 41,07.
- 🔴 **Meta contando a menos:** Kiwify tem 2 vendas, o Meta 1. A venda de 2026-10-28 (Pix) nunca
  foi atribuída. A outra chegou depois da correção do `fbclid`/`utm` na página. O token da API de
  Conversões ainda não foi colado na Kiwify; sem ele o Meta otimiza com metade das vendas.
- 🟡 **Aprendizado reiniciado:** orçamento trocado de R$ 20 para R$ 14 e público "segmentado". Cada
  edição grande reinicia o aprendizado do Meta.

## Pra fazer agora

1. ~~Conferir na Kiwify quantas vendas pagas saíram desde 26/10~~ (feito: 2 vendas, o Meta contou 1).
2. **Colar o token da API de Conversões na Kiwify** (pendente desde 2026-10-28). Sem ele o Meta
   otimiza no escuro, e com R$ 14/dia cada compra perdida pesa muito.
3. **Mandar um print no nível "Anúncios"** com as colunas impressões, cliques no link, CTR (link),
   CPC (link), CPM, frequência e visualizações da página de destino. Com isso dá para pausar os
   anúncios ruins pelo nome.
4. **Não subir orçamento e não editar a campanha** nos próximos dias. Regra de parada: se a perda
   chegar ao limite combinado (o plano sugeria R$ 100, faltam cerca de R$ 59) sem nova venda,
   pausar e mexer na página ou nos criativos antes de gastar mais.
5. **Pensar no ticket:** com R$ 15,71 de margem, quase nenhum anúncio pago empata. O caminho mais
   comum no ebook barato é um order bump na Kiwify (um item extra barato no checkout), que aumenta o
   valor de cada venda sem mexer no anúncio.

## Leitura no Gerenciador, por posicionamento (2026-10-29)

Campanha "segmentada", 25 a 29/10, colunas "Desempenho e cliques" com detalhamento por posicionamento.
Gasto R$ 76,14 (só R$ 34,36 nos anúncios C1 e C3 que ainda existem; o resto foi em anúncios apagados).

| | Impressões | Cliques no link | Visualizações da página | Gasto (estimado) |
|---|---|---|---|---|
| Campanha inteira | 2.198 | 422 (CTR 19,2%, CPC R$ 0,18) | 252 | R$ 76,14 |
| Audience Network (vídeo com incentivo + nativo/banner) | 1.284 | 404 (96%) | 242 (96%) | ~R$ 4,43 |
| Facebook + Instagram | ~914 | 18 (CTR ~2%, CPC ~R$ 3,98) | 10 | ~R$ 71,71 (CPM ~R$ 78) |

- O CTR de 19% e o CPC de R$ 0,18 são falsos: 96% dos cliques vieram da Audience Network, quase
  todos de "Vídeo com incentivo" (anúncio em jogo de celular, que a pessoa clica para ganhar prêmio
  no jogo). Esse tráfego não compra.
- O tráfego real (Facebook + Instagram) é caro: ~R$ 4 por clique, CPM ~R$ 78.
- Com só 10 visitas reais vieram 3 finalizações e pelo menos 1 compra atribuída: a página parece
  converter bem, mas a amostra é pequena demais para garantir.

**Correção:** no conjunto de anúncios, em Posicionamentos, desmarcar a Audience Network. Depois,
avaliar abrir o público (tirar os interesses da "segmentada") para baixar o CPM.

**Feito em 2026-10-29:** Audience Network desmarcada no conjunto "Segmentado 1" (Plataformas:
Facebook, Instagram e Threads; 16 posicionamentos incluídos, 2 excluídos) e desligado o "Permitir
gasto limitado em posicionamentos excluídos", que o Meta marca sozinho e mandaria ~5% do orçamento
para cada posicionamento excluído. Publicado. A campanha está desligada: a mudança só vale quando
ela for religada, e o aprendizado do Meta recomeça.
