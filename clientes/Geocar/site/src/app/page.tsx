import Image from "next/image";
import Link from "next/link";
import EstoqueGrid from "@/components/EstoqueGrid";
import Icon, { type IconName } from "@/components/Icon";
import { anoLabel, nomeVeiculo } from "@/lib/format";
import { ENDERECO, INSTAGRAM_URL, MAPA_EMBED_URL, MAPA_LINK_URL } from "@/lib/loja";
import { getVitrine } from "@/lib/vehicles";
import { VENDEDORES, linkWhatsapp } from "@/lib/whatsapp";

// Sem isso o Next.js congela a página no build e o que o admin cadastrar
// não aparece até o próximo deploy.
export const dynamic = "force-dynamic";

const SERVICOS: { icon: IconName; titulo: string; texto: string; mensagem: string; cta: string }[] = [
  {
    icon: "swap",
    titulo: "Troque seu carro",
    texto: "Seu usado entra como parte do pagamento. Traz ele aqui que a gente avalia.",
    mensagem: "Olá! Quero trocar meu carro. Como funciona a avaliação?",
    cta: "Avaliar meu carro",
  },
  {
    icon: "money",
    titulo: "Financie sem complicação",
    texto: "Simule as parcelas com a gente e escolha o plano que cabe no seu bolso.",
    mensagem: "Olá! Quero simular um financiamento.",
    cta: "Simular parcelas",
  },
  {
    icon: "key",
    titulo: "Venda pra Geocar",
    texto: "Quer vender sem dor de cabeça? A Geocar também compra o seu carro.",
    mensagem: "Olá! Quero vender meu carro pra Geocar.",
    cta: "Vender meu carro",
  },
];

export default async function Home() {
  const vehicles = await getVitrine();
  const destaque = vehicles.find((v) => v.destaque && v.fotos.length > 0) ?? vehicles[0];
  const vendedor = VENDEDORES[0];

  const beneficios: { icon: IconName; texto: string }[] = [
    { icon: "car", texto: `${vehicles.length} veículos no estoque` },
    { icon: "shield", texto: "Veículos revisados" },
    { icon: "swap", texto: "Aceitamos sua troca" },
    { icon: "money", texto: "Financiamento facilitado" },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-full w-[70%] skew-x-[-14deg] bg-gradient-to-b from-azul/50 to-ink-soft"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 hidden h-full w-3 skew-x-[-14deg] bg-brand md:block"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-celeste">
              <Icon name="pin" className="h-4 w-4 text-brand" />
              Sobradinho · DF
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold italic leading-[1.05] sm:text-5xl md:text-6xl">
              Seu próximo carro <span className="text-brand">está aqui!</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
              Seminovos revisados, troca facilitada e financiamento. Escolha pelo
              site e fale direto com a gente no WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#estoque"
                className="rounded-full bg-brand px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-dark"
              >
                Ver estoque
              </Link>
              <a
                href={linkWhatsapp(vendedor.numero, "Olá! Vim pelo site da Geocar.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Icon name="whatsapp" className="h-5 w-5 text-[#25d366]" />
                Falar no WhatsApp
              </a>
            </div>
            <p className="mt-8 text-sm font-medium tracking-wide text-white/50">
              Compra <span className="text-brand">•</span> Venda{" "}
              <span className="text-brand">•</span> Troca <span className="text-brand">•</span>{" "}
              Financiamento
            </p>
          </div>

          {destaque && (
            <Link
              href={`/carro/${destaque.slug}`}
              className="group relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/10 md:max-w-none"
            >
              <Image
                src={destaque.fotos[0]}
                alt={nomeVeiculo(destaque)}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 480px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-16">
                <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                  Destaque
                </span>
                <p className="mt-2 font-display text-xl font-bold">
                  {nomeVeiculo(destaque)} {anoLabel(destaque)}
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-white/80">
                  Ver detalhes <Icon name="arrow-right" className="h-4 w-4" />
                </p>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
          {beneficios.map((b) => (
            <div key={b.texto} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-azul/10 text-azul">
                <Icon name={b.icon} className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-ink">{b.texto}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ESTOQUE */}
      <section id="estoque" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">Estoque</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-ink md:text-4xl">
              Escolha o seu
            </h2>
          </div>
          <p className="max-w-sm text-sm text-neutral-500">
            Todos com fotos reais, tiradas aqui na loja. Gostou de um? Chama no
            WhatsApp direto da página do carro.
          </p>
        </div>
        <EstoqueGrid vehicles={vehicles} />
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-20">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
            Troca e financiamento
          </p>
          <h2 className="mt-1 font-display text-3xl font-extrabold text-ink md:text-4xl">
            A gente facilita o negócio
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {SERVICOS.map((s) => (
            <div
              key={s.titulo}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white">
                <Icon name={s.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-ink">{s.titulo}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{s.texto}</p>
              <a
                href={linkWhatsapp(vendedor.numero, s.mensagem)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                {s.cta}
                <Icon name="arrow-right" className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-20">
        <div className="grid overflow-hidden rounded-3xl bg-ink text-white md:grid-cols-2">
          <div className="p-8 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">Onde estamos</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold">Vem ver de perto</h2>
            <p className="mt-4 flex items-start gap-2 text-white/75">
              <Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              {ENDERECO}
            </p>
            <a
              href={MAPA_LINK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-celeste hover:text-white"
            >
              Abrir no Google Maps →
            </a>

            <div className="mt-8 flex flex-col gap-3">
              {VENDEDORES.map((v) => (
                <a
                  key={v.numero}
                  href={linkWhatsapp(v.numero, "Olá! Vim pelo site da Geocar.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 transition-colors hover:bg-white/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25d366] text-white">
                    <Icon name="whatsapp" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">{v.nome}</span>
                    <span className="block text-sm text-white/60">{v.exibicao}</span>
                  </span>
                </a>
              ))}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-1 pt-2 text-sm font-semibold text-white/70 hover:text-white"
              >
                <Icon name="instagram" className="h-5 w-5" />
                @geocarautomoveis
              </a>
            </div>
          </div>
          <iframe
            title="Mapa da Geocar Automóveis"
            src={MAPA_EMBED_URL}
            className="h-80 w-full border-0 md:h-full md:min-h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
