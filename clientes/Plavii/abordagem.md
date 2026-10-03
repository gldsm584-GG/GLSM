# Abordagem — Plavii (loja funcional)

> Substitui o roteiro antigo, que era do mockup estático. Agora o que se
> mostra é a loja de verdade, publicada em https://plavii.vercel.app.

## Plano em resumo

- **Canal:** WhatsApp ou DM do Instagram (primeiro contato frio).
- **Primeiro passo:** prints da loja + link pra ele navegar sozinho.
- **Preço:** não puxar o assunto. Só responder se ele perguntar.
- **Meta do primeiro contato:** ele olhar e topar uma conversa curta (10 min).
  Não é fechar nada na primeira mensagem.

## Antes de mandar qualquer coisa (limpeza)

O dono vai abrir o link, então o site tem que estar apresentável. Pendências
do `briefing.md` que aparecem pra ele:

- [ ] Remover o produto de teste do catálogo (ex: "blb", Power Bank a R$ 1,00)
- [ ] Limpar os pedidos de teste do banco de pedidos
- [ ] Conferir o carrinho e o Hero no celular de verdade (arraste e lixeira
      foram testados só em emulador)
- [ ] Tirar prints novos: home (celular), página de produto, carrinho

Atenção: o Mercado Pago ainda está em modo teste, então **não prometa que já
dá pra vender de verdade**. Diga que é uma versão pronta pra apresentar.

## Mensagem de abertura (WhatsApp/DM)

Mandar primeiro o print `home-mobile`, depois o texto:

> Oi! Tudo bem? Vi a Plavii e achei a loja de vocês muito boa. Fiz uma versão
> online nova com os produtos de vocês, pensando em vender mais mesmo com a
> loja física fechada. Dá uma olhada 👀
>
> Esse é o link, dá pra navegar de verdade, colocar no carrinho e tudo:
> https://plavii.vercel.app
>
> Se curtir, posso te mostrar em 10 minutos como funciona por dentro, onde
> você muda preço e produto sozinho, sem depender de ninguém. Topa?

Ajustar o tom na hora (a régua é "direto e simples", `_memoria/preferencias.md`).
Se ele responder só com "legal", seguir com a pergunta dos 10 minutos.

## Se ele responder: prints + link

Ordem dos prints (3 a 4, não mais que isso):

1. Home no celular (Hero + ofertas)
2. Página de um produto (fotos, preço, opiniões)
3. Carrinho
4. Painel de admin (dashboard de vendas), só se ele perguntar "e eu, como mexo?"

## Roteiro da demonstração (10 minutos, por chamada ou presencial)

Objetivo: ele sair pensando "isso eu consigo mexer e vende sozinho".

| Min | O que mostrar | O que dizer (ideia) |
|---|---|---|
| 0-1 | Home no celular | "Carrega rápido e fica bom no celular, que é de onde a maioria compra." |
| 1-3 | Buscar um produto, abrir, adicionar ao carrinho, tirar pela lixeira | "O cliente acha o que quer em poucos toques." |
| 3-5 | Checkout e conta do cliente | "Ele cria conta, salva endereço, paga no Pix/cartão (Mercado Pago)." |
| 5-8 | **Painel admin**: editar preço/produto direto na loja, trocar o Hero, criar Ofertas relâmpago | "Você muda tudo daqui, sem me chamar." (o ponto mais forte) |
| 8-9 | Dashboard financeiro (receita, pedidos, mais vendidos) | "Você vê quanto vendeu e o que mais sai." |
| 9-10 | Fechar com pergunta | "O que você mudaria? O que faltou?" |

Dicas:
- Deixar ele **mexer** (editar um preço) vale mais que explicar.
- Anotar o que ele pedir de ajuste: vira argumento pra conversa seguinte.
- Frase de fechamento: *"Sua loja vendendo mesmo com a porta fechada."*

## Preço (só se ele perguntar)

Resposta pronta:

> Faço como projeto fechado, pagamento único, não é mensalidade. Fica
> R$ 5.000 e inclui o site completo, o painel pra você editar e eu passo
> todas as contas pro seu nome (hospedagem, banco de dados, pagamento,
> domínio), então você é dono de tudo.

- Piso interno: R$ 4.000. **Não revelar**; só ceder se ele pedir desconto.
- Se perguntar de custo mensal: depois da transferência, as ferramentas ficam
  por conta dele, em torno de US$ 45/mês (Vercel Pro + Supabase Pro), mais o
  domínio .com.br (~R$ 40/ano) e a taxa do Mercado Pago por venda (sem
  mensalidade).
- Mudanças depois da entrega são serviço à parte.

## Respostas pras objeções

- **"Tá caro."** → "Entendo. Pensa que é pagamento único: não tem mensalidade
  minha. Compara com o que você paga hoje de plataforma e comissão. Se
  fizer sentido, a gente vê um formato que caiba." (aqui entra a negociação
  até o piso)
- **"Já tenho site (WordPress)."** → "Vi, e o seu funciona. A diferença é que
  esse é mais rápido, você edita sozinho sem plugin, e não tem produto
  duplicado como aparece no atual." (usar o ponto dos produtos "(cópia)"
  duplicados na categoria Eletrônicos, se ainda estiver assim)
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
3. Domínio próprio, Mercado Pago em modo produção, Vercel Pro, SMTP
   (ver checklist completo no `briefing.md`).
4. Transferir contas (Vercel, Supabase, Mercado Pago, domínio) pro dono.
