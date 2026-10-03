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
`clientes/Plavii/briefing.md`). Falta: configurar domínio próprio, colocar
o Mercado Pago em modo produção de verdade (hoje ainda em teste) e
atualizar a `abordagem.md` (ela ainda descreve o mockup estático antigo,
não a loja funcional publicada).

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
decisão de modelo comercial (venda única R$ 4-5 mil, contas transferidas
pro dono depois, que passa a pagar as assinaturas) estão detalhados em
`clientes/Plavii/briefing.md`.

## O que pode esperar

Nome de marca própria já definido (GLSM, 2026-09-28). Falta a identidade
visual pessoal (cores, tipografia, logo) — isso pode esperar.

## Contexto com prazo

Falta de dinheiro é a pressão principal agora — prioridade é fechar
o primeiro cliente (Plavii) o quanto antes.
