import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade — Plavii",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-bold text-neutral-800">{title}</h2>
      <div className="flex flex-col gap-3 leading-relaxed text-neutral-700">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand">
          Início
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-700">Política de Privacidade</span>
      </nav>

      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-800 md:text-3xl">
        Política de Privacidade
      </h1>
      <p className="mt-2 text-sm text-neutral-400">Última atualização: 30 de setembro de 2026</p>

      <p className="mt-6 leading-relaxed text-neutral-700">
        Essa política explica quais dados a Plavii coleta quando você usa esse site, pra que eles
        servem, com quem são compartilhados e quais direitos você tem sobre eles — seguindo a Lei
        Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).
      </p>

      <div className="mt-8 flex flex-col gap-8">
        <Section title="1. Quem é o responsável pelos seus dados">
          <p>
            A Plavii é a controladora dos dados pessoais tratados nesse site.{" "}
            <em>
              (Razão social e CNPJ a serem preenchidos aqui assim que o cadastro da empresa for
              formalizado.)
            </em>
          </p>
        </Section>

        <Section title="2. Quais dados coletamos">
          <p>Coletamos os dados que você mesmo nos informa ao usar o site:</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Ao criar uma conta:</strong> nome, sobrenome, telefone (e um segundo
              telefone, opcional), email e senha.
            </li>
            <li>
              <strong>Ao cadastrar um endereço:</strong> CEP, rua, número, complemento, bairro,
              cidade e estado.
            </li>
            <li>
              <strong>Ao fazer um pedido:</strong> os itens comprados, o valor e o endereço de
              entrega escolhido.
            </li>
            <li>
              <strong>Ao avaliar um produto:</strong> a nota, o comentário e fotos que você decidir
              enviar.
            </li>
            <li>
              <strong>Favoritos e histórico de produtos vistos:</strong> ficam salvos só no seu
              próprio navegador — não são enviados pros nossos servidores.
            </li>
          </ul>
          <p>
            Sua senha nunca fica salva de um jeito que dê pra ler — ela é protegida por um serviço
            especializado de autenticação, e nem a própria Plavii tem acesso a ela.
          </p>
        </Section>

        <Section title="3. Para que usamos seus dados">
          <ul className="list-disc pl-5">
            <li>Criar e gerenciar sua conta</li>
            <li>Processar, entregar e dar suporte aos seus pedidos</li>
            <li>Preencher seu endereço automaticamente a partir do CEP</li>
            <li>Mostrar suas avaliações públicas nos produtos</li>
            <li>Cumprir obrigações legais e fiscais</li>
            <li>Melhorar o funcionamento do site</li>
          </ul>
          <p>Não usamos seus dados pra anúncio direcionado nem vendemos seus dados pra terceiros.</p>
        </Section>

        <Section title="4. Com quem compartilhamos seus dados">
          <ul className="list-disc pl-5">
            <li>
              <strong>WhatsApp:</strong> ao finalizar o carrinho, a lista de itens vai numa
              mensagem pro WhatsApp da loja, e o pagamento e a entrega são combinados por lá. O
              site não processa pagamento e não recebe nem guarda o número do seu cartão.
            </li>
            <li>
              <strong>Supabase:</strong> empresa que hospeda o banco de dados e o login do site.
            </li>
          </ul>
          <p>
            Não compartilhamos seus dados com mais ninguém, exceto quando exigido por lei ou ordem
            judicial.
          </p>
        </Section>

        <Section title="5. Cookies e armazenamento no navegador">
          <p>
            Esse site usa armazenamento local do navegador só pra funções essenciais: manter você
            logado, guardar o carrinho de compras e lembrar seus favoritos e histórico. Não usamos
            cookies de rastreamento nem de publicidade de terceiros.
          </p>
        </Section>

        <Section title="6. Por quanto tempo guardamos seus dados">
          <p>
            Guardamos os dados da sua conta e dos seus pedidos enquanto sua conta existir, ou pelo
            tempo exigido por lei (por exemplo, obrigações fiscais). Você pode pedir a exclusão a
            qualquer momento — ver seção 8.
          </p>
        </Section>

        <Section title="7. Como protegemos seus dados">
          <p>
            Seus dados de cadastro ficam num banco protegido por controle de acesso, e só você (e,
            quando necessário pra atender seu pedido, a administração da loja) consegue ver seus
            próprios dados. A conexão com o site é sempre criptografada (HTTPS).
          </p>
        </Section>

        <Section title="8. Seus direitos">
          <p>De acordo com a LGPD, você pode a qualquer momento:</p>
          <ul className="list-disc pl-5">
            <li>Confirmar se tratamos algum dado seu</li>
            <li>Pedir uma cópia dos seus dados</li>
            <li>Corrigir dados incompletos ou desatualizados</li>
            <li>Pedir a exclusão dos seus dados (exceto o que formos obrigados a manter por lei)</li>
            <li>Revogar um consentimento que tenha dado</li>
            <li>Pedir a portabilidade dos seus dados pra outro serviço</li>
          </ul>
          <p>
            Pra exercer qualquer um desses direitos, entre em contato:{" "}
            <strong>[email de contato da Plavii]</strong>
          </p>
        </Section>

        <Section title="9. Menores de idade">
          <p>
            Esse site não é direcionado a menores de 18 anos. Se você é responsável por um menor e
            acredita que ele nos forneceu dados, entre em contato pra que possamos removê-los.
          </p>
        </Section>

        <Section title="10. Mudanças nessa política">
          <p>
            Podemos atualizar essa política de vez em quando. Sempre que isso acontecer,
            atualizamos a data no topo da página.
          </p>
        </Section>
      </div>
    </div>
  );
}
