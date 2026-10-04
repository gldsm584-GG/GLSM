# Abordagem — Plavii (catálogo + WhatsApp)

> Substitui o roteiro antigo, que era do mockup estático. O que se mostra
> agora é a loja de verdade, publicada em https://plavii.vercel.app, no
> formato vitrine/catálogo: o carrinho finaliza num link de WhatsApp e quem
> fecha pagamento e entrega é a atendente (mudança de 2026-10-04, ver
> `briefing.md`).

## Plano em resumo

- **Canal:** WhatsApp ou DM do Instagram (primeiro contato frio).
- **Primeiro passo:** prints da loja + link pra ele navegar sozinho.
- **Preço:** não puxar o assunto. Só responder se ele perguntar.
- **Meta do primeiro contato:** ele olhar e topar uma conversa curta (10 min).
  Não é fechar nada na primeira mensagem.
- **O que descobrir na conversa:** como ele fecha venda hoje (pagamento,
  entrega, retirada). Foi justamente isso que fez o site virar vitrine: o
  fechamento fica com a atendente, do jeito que a loja já trabalha.

## Antes de mandar qualquer coisa

O dono vai abrir o link, então o site tem que estar apresentável.

- [x] Remover o produto de teste do catálogo (ex: "blb", Power Bank a R$ 1,00)
- [x] Limpar os pedidos de teste do banco de pedidos
- [x] Conferir o carrinho e o Hero no celular de verdade (arraste e lixeira
      funcionam)
- [x] Corrigir a categoria "Pets" do Projetor HY300
- [x] Prints de home e de produtos (aprovados como estão em 2026-10-04; o
      coração marcado e o Power Bank cortado ficaram de propósito)
- [ ] **Trocar o número de WhatsApp placeholder** (`5561999999999` em
      `src/lib/whatsapp.ts`) pelo número real da loja. Sem isso, o botão
      "Finalizar no WhatsApp" manda a mensagem pro número errado.
- [ ] **Refazer o print do carrinho:** o que existe é da versão antiga
      ("Finalizar compra"). O novo mostra "Finalizar no WhatsApp".

Atenção: o site **não cobra nem processa pagamento**. Não prometa venda
automática: a venda fecha pelo WhatsApp com a atendente. Diga que é uma
vitrine pronta pra apresentar.

## Mensagem de abertura (WhatsApp/DM)

Mandar primeiro o print `home-mobile`, depois o texto:

> Oi! Tudo bem? Vi a Plavii e achei a loja de vocês muito boa. Fiz uma versão
> online nova com os produtos de vocês, pensando em vender mais mesmo com a
> loja física fechada. Dá uma olhada 👀
>
> Esse é o link, dá pra navegar de verdade e colocar no carrinho; o pedido
> chega direto no WhatsApp de vocês:
> https://plavii.vercel.app
>
> Se curtir, posso te mostrar em 10 minutos como funciona por dentro, onde
> você muda preço e produto sozinho, sem depender de ninguém. Topa?

A frase sobre o pedido chegar no WhatsApp só vale depois de trocar o número
placeholder. Ajustar o tom na hora (a régua é "direto e simples",
`_memoria/preferencias.md`). Se ele responder só com "legal", seguir com a
pergunta dos 10 minutos.

## Se ele responder: prints + link

Ordem dos prints (3 a 4, não mais que isso):

1. Home no celular (Hero + ofertas)
2. Página de um produto (fotos, preço, opiniões)
3. Carrinho com o botão "Finalizar no WhatsApp"
4. Painel de admin (Pedidos / "Nova venda"), só se ele perguntar "e eu, como
   mexo?"

## Roteiro da demonstração (10 minutos, por chamada ou presencial)

Objetivo: ele sair pensando "isso eu consigo mexer, e o cliente chega até
minha atendente com o pedido pronto".

| Min | O que mostrar | O que dizer (ideia) |
|---|---|---|
| 0-1 | Home no celular | "Carrega rápido e fica bom no celular, que é de onde a maioria compra." |
| 1-3 | Buscar um produto, abrir, adicionar ao carrinho, tirar pela lixeira | "O cliente acha o que quer em poucos toques." |
| 3-4 | **"Finalizar no WhatsApp"** (abre a conversa com a lista e o total prontos) | "O pedido chega pronto na sua atendente. Ela fecha pagamento e entrega do jeito que vocês já fazem." |
| 4-5 | Painel admin, **Pedidos → "+ Nova venda"** (lançar a venda fechada no WhatsApp) | "Fechou no WhatsApp, é só registrar aqui em segundos." |
| 5-8 | **Painel admin**: editar preço/produto direto na loja, trocar o Hero, criar Ofertas relâmpago | "Você muda tudo daqui, sem me chamar." (o ponto mais forte) |
| 8-9 | Clientes e pedidos (agrupados pelo telefone) | "Você vê quem comprou e o que mais sai." |
| 9-10 | Fechar com pergunta | "Como vocês fecham hoje, pagamento e entrega? O que mudaria? O que faltou?" |

Dicas:
- Deixar ele **mexer** (editar um preço) vale mais que explicar.
- **Cuidado no passo "Finalizar no WhatsApp":** só faça isso depois de trocar
  o número placeholder, e **não envie** a mensagem de teste pra loja de verdade.
- Se lançar uma venda de teste em "Nova venda", **apague depois**, pra não
  sujar o banco.
- Anotar o que ele pedir de ajuste: vira argumento pra conversa seguinte.
- O dashboard financeiro saiu do menu (as métricas de receita não fazem
  sentido sem checkout automático). A página existe em `/admin`, mas não é
  parte do roteiro.
- Frase de fechamento: *"Sua loja vendendo mesmo com a porta fechada."*

## Preço (só se ele perguntar)

Resposta pronta:

> Faço como projeto fechado, não é mensalidade. Fica R$ 4.000 no Pix, ou
> 3x de R$ 1.500 no cartão. Inclui o site completo, o painel pra você
> editar e eu passo todas as contas pro seu nome (hospedagem, banco de
> dados, domínio), então você é dono de tudo.

- Duas opções: **R$ 4.000 no Pix** (à vista) ou **3x de R$ 1.500** (R$ 4.500
  no total). O parcelado custa R$ 500 a mais, o que incentiva o Pix.
- Esse já é o menor valor: não tem desconto adicional. Se ele pedir mais,
  segurar o preço e oferecer algo no lugar (ex: um ajuste pequeno depois da
  entrega) em vez de baixar.
- Parcelado: cobrar no **cartão de crédito** (maquininha ou link de
  pagamento da sua própria conta), pra o risco de calote não ser seu. O
  site não cobra mais, então esse recebimento é à parte. Passar as contas
  pro nome dele só depois do pagamento completo.
- Se perguntar de custo mensal: depois da transferência, as ferramentas ficam
  por conta dele, em torno de US$ 45/mês (Vercel Pro + Supabase Pro), mais o
  domínio .com.br (~R$ 40/ano). Sem taxa por venda, porque o site não
  processa pagamento.
- Mudanças depois da entrega são serviço à parte.

## Respostas pras objeções

- **"Tá caro."** → "Entendo. Pensa que é pagamento único: não tem mensalidade
  minha. Compara com o que você paga hoje de plataforma e comissão. Dá
  pra dividir em 3x no cartão pra pesar menos." (não baixar o preço; a
  flexibilidade é o parcelamento)
- **"Já tenho site (WordPress)."** → "Vi, e o seu funciona. A diferença é que
  esse é mais rápido, você edita sozinho sem plugin, e não tem produto
  duplicado como aparece no atual." (usar o ponto dos produtos "(cópia)"
  duplicados na categoria Eletrônicos, se ainda estiver assim)
- **"Como o cliente paga?"** → "Ele monta o carrinho e finaliza no WhatsApp.
  Sua atendente combina pagamento e entrega do jeito que vocês já fazem
  (Pix, cartão, retirada ou entrega). Depois você registra a venda no
  painel." (se ele quiser pagamento online no site, é um próximo passo, à parte)
- **"Preciso pensar."** → "Claro. Posso deixar o link com você pra olhar com
  calma. Se quiser, te mando um resumo do que está incluso." (e marcar de
  retornar em 2-3 dias)
- **"E se der problema depois?"** → "As contas ficam no seu nome, então você
  não depende de mim pra nada funcionar. Qualquer ajuste depois eu faço à
  parte, combinado antes."
- **"Quem cuida disso?"** → "Você mesmo edita pelo painel, é bem simples. Se
  travar, me chama."
- **"Não tenho tempo agora."** → "Sem pressa. Te deixo o link e a gente
  conversa quando você puder."

## Próximos passos (depois do sim)

1. Formalizar o acordo por escrito (a Plavii ainda não é cliente fechado).
2. Preencher razão social/CNPJ e email de contato na Política de Privacidade.
3. Domínio próprio, Vercel Pro e SMTP (ver checklist completo no
   `briefing.md`).
4. Transferir contas (Vercel, Supabase, domínio) pro dono.
