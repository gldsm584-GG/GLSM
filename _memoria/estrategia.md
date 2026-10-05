# Estratégia

> O que importa agora. Prioridades, metas, prazos.
> O Claude usa isso pra decidir o que sugerir primeiro e o que adiar.
> Atualize sempre que as prioridades mudarem.

## Fase

Começando — primeiro cliente em prospecção (Plavii), ainda sem nenhum fechado.

## Prioridade principal

Gargalo atual: entender na prática como um site de verdade funciona,
principalmente a parte de meios de pagamento e integrações — ainda
está aprendendo isso.

Objetivo imediato: apresentar a loja funcional da Plavii (loja
multicategoria — eletrônicos, acessórios, utilidades — hoje em
WordPress/WooCommerce) ao dono e fechar o cliente. O site em Next.js está
publicado em produção (https://plavii.vercel.app, projeto Vercel próprio
do Gustavo) com os recursos novos de 2026-09-27 (produto editável direto
na loja, páginas em branco, opiniões de produto, Hero em carrossel com
botões flutuantes arrastáveis, painel de Ofertas relâmpago com produtos
escolhidos à mão, detalhes de cliente no admin — ver
`clientes/Plavii/briefing.md`). A `abordagem.md` foi reescrita em 2026-10-03
pra loja funcional (mensagem de abertura, roteiro de demonstração,
objeções e preço). O produto de teste ("blb") e os pedidos de teste já
foram removidos (2026-10-03). O Hero (arraste, altura no celular) e a
lixeira do carrinho já foram conferidos num celular de verdade, e os prints
de home, produtos e carrinho estão tirados (2026-10-04). A categoria
"Pets" do Projetor HY300 foi corrigida e os prints foram aprovados como
estão (2026-10-04).

ENTREGA (2026-10-05): o checkout ganhou "Método de entrega" — retirada na loja
(grátis) ou frete cotado no Melhor Envio (Correios, Jadlog etc.). Pra ligar o
frete falta o Gustavo criar a conta no Melhor Envio, guardar o token e o CEP da
loja na Vercel e rodar a migração 020 — passo a passo no `briefing.md`. Sem
isso o site oferece só a retirada.

REVERTIDO em 2026-10-05 (pedido do Gustavo, "os dois jeitos"): o pagamento
pelo Mercado Pago voltou — checkout, página do pedido, rotas da API e o
seletor "Entregar em" do cabeçalho, Dashboard no menu do admin, cancelar/
apagar pedido na conta do cliente. O carrinho agora tem "Finalizar compra"
(Mercado Pago) e "Finalizar no WhatsApp". Ficaram da fase WhatsApp o painel
"Nova venda", o kanban de pedidos e a lista de clientes por telefone. O
Mercado Pago volta em modo TESTE: antes de vender de verdade precisa do
token de produção em `MERCADOPAGO_ACCESS_TOKEN` na Vercel e do webhook no
painel do Mercado Pago. O texto abaixo é o histórico da fase só-WhatsApp.

Mudança de rumo em 2026-10-04 (decisão do Gustavo antes de levar ao
dono): a loja tava virando complexa demais (checkout, Mercado Pago,
endereço salvo) sem nunca ter confirmado com o dono como ele realmente
entrega/recebe pagamento — risco de o cliente não fechar por parecer
complicado demais. O site virou vitrine/catálogo: carrinho finaliza
direto num link de WhatsApp (mensagem pronta com os itens), e quem fecha
forma de pagamento/entrega é a atendente, por fora do site. Mercado Pago
foi removido do projeto inteiro (não é mais pendência colocar em
produção). Painel admin ganhou lançamento de venda manual (pra registrar
o que fechar no WhatsApp) e Pedidos/Clientes voltaram a aparecer no menu
alimentados por isso — ver `clientes/Plavii/briefing.md`.

O botão "Finalizar no WhatsApp" já foi testado de ponta a ponta (2026-10-04)
com o número de TESTE do Gustavo (`61 99191-8921`), que continua no site de
propósito. A mensagem sai com o nome do cadastro quando o cliente está
logado e sem nome quando não tem cadastro, no texto "Tenho interesse em
comprar este produto que vi no site:". Próximo passo antes de mandar a
mensagem de abertura ao dono: trocar o número de teste
(`src/lib/whatsapp.ts`) pelo número real da loja — enquanto o de teste
estiver lá, não mostrar o link a ninguém. Depois disso, falta só configurar
domínio próprio.

Pendência técnica resolvida em 2026-09-27: repositório próprio criado
(github.com/gldsm584-GG/GLSM) e projeto Vercel próprio (time
`glsmteste`) publicando em plavii.vercel.app. O repositório e o projeto
Vercel antigos (`mazzeoia/MazyOS` e o time Vercel original) ficaram pra
trás — a conta do Gustavo não tem acesso a eles.

Entre 2026-09-28 e 2026-09-30, mais rodadas de ajuste na loja: corrigida
uma falha de segurança no checkout (pedido só podia ser pago pelo
próprio dono), menu do admin consolidado num botão só ("Editar site"),
categorias viraram editáveis pelo admin (antes eram lista fixa no
código), painel `/admin` ganhou um dashboard financeiro com gráficos
(receita ao longo do tempo, pedidos por status, mais vendidos, tudo com
seletor de período), rodapé com ícones de Instagram/Facebook e favicon
trocado pro logo real da Plavii. Em 2026-09-30, foi criada a Política de
Privacidade (`/politica-de-privacidade`) e tirado o CNPJ do rodapé (a
Plavii ainda não é cliente fechado).

Checklist completo do que falta antes do lançamento de verdade, e a
decisão de modelo comercial (venda única: R$ 4.000 no Pix ou 3x de
R$ 1.500 no cartão, sem desconto adicional; contas transferidas pro dono
depois do pagamento completo, que passa a pagar as assinaturas) estão detalhados em
`clientes/Plavii/briefing.md`.

## O que pode esperar

Nome de marca própria já definido (GLSM, 2026-09-28). Falta a identidade
visual pessoal (cores, tipografia, logo) — isso pode esperar.

## Contexto com prazo

Falta de dinheiro é a pressão principal agora — prioridade é fechar
o primeiro cliente (Plavii) o quanto antes.
