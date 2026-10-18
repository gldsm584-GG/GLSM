import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import VehicleCard from "@/components/VehicleCard";
import VehicleGallery from "@/components/VehicleGallery";
import { anoLabel, formatKm, formatPreco, nomeVeiculo } from "@/lib/format";
import { getOutros, getVehicleBySlug } from "@/lib/vehicles";
import {
  VENDEDORES,
  linkWhatsapp,
  mensagemFinanciamento,
  mensagemInteresse,
} from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicleBySlug(slug);
  if (!v) return { title: "Veículo não encontrado" };
  const titulo = `${nomeVeiculo(v)} ${anoLabel(v)}`;
  return {
    title: titulo,
    description: v.descricao || `${titulo} na Geocar Automóveis, em Sobradinho - DF.`,
    openGraph: { title: titulo, images: v.fotos.slice(0, 1) },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const h = await headers();
  const url = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}/carro/${vehicle.slug}`;
  const outros = await getOutros(vehicle);
  const vendido = vehicle.status === "vendido";
  const km = formatKm(vehicle.km);

  const ficha: { icon: IconName; label: string; valor: string | null }[] = [
    { icon: "calendar", label: "Ano", valor: anoLabel(vehicle) },
    { icon: "gauge", label: "Quilometragem", valor: km },
    { icon: "gear", label: "Câmbio", valor: vehicle.cambio || null },
    { icon: "engine", label: vehicle.tipo === "moto" ? "Cilindrada" : "Motor", valor: vehicle.motor || null },
    { icon: "fuel", label: "Combustível", valor: vehicle.combustivel || null },
    { icon: "palette", label: "Cor", valor: vehicle.cor || null },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <nav className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand">
          Início
        </Link>
        <span>/</span>
        <Link href="/#estoque" className="hover:text-brand">
          Estoque
        </Link>
        <span>/</span>
        <span className="truncate text-ink">{nomeVeiculo(vehicle)}</span>
      </nav>

      {vendido && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-4 text-white">
          <p className="font-semibold">Esse veículo já foi vendido.</p>
          <Link href="/#estoque" className="text-sm font-semibold text-celeste hover:text-white">
            Ver o estoque atual →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <VehicleGallery fotos={vehicle.fotos} alt={nomeVeiculo(vehicle)} />

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold uppercase tracking-wider text-azul">
                {vehicle.marca}
              </span>
              {vehicle.status === "reservado" && (
                <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold uppercase text-white">
                  Reservado
                </span>
              )}
            </div>
            <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-ink md:text-4xl">
              {[vehicle.modelo, vehicle.versao, vehicle.tipo === "carro" ? vehicle.motor : ""]
                .filter(Boolean)
                .join(" ")}
            </h1>
            <p className="mt-2 text-neutral-500">
              {[anoLabel(vehicle), km, vehicle.cambio, vehicle.cor].filter(Boolean).join(" · ")}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-neutral-500">Preço</p>
            <p className="font-display text-3xl font-extrabold text-ink">
              {vehicle.preco == null ? "Sob consulta" : formatPreco(vehicle.preco)}
            </p>
            <p className="mt-1 text-sm text-neutral-500">Aceitamos troca · Financiamento facilitado</p>

            {!vendido && (
              <div className="mt-5 flex flex-col gap-2.5">
                {VENDEDORES.map((v) => (
                  <a
                    key={v.numero}
                    href={linkWhatsapp(v.numero, mensagemInteresse(vehicle, url))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-3.5 font-semibold text-white transition hover:brightness-95"
                  >
                    <Icon name="whatsapp" className="h-5 w-5" />
                    Tenho interesse — falar com {v.nome}
                  </a>
                ))}
                <a
                  href={linkWhatsapp(VENDEDORES[0].numero, mensagemFinanciamento(vehicle, url))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-azul hover:text-azul"
                >
                  <Icon name="money" className="h-5 w-5" />
                  Simular financiamento
                </a>
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-ink">Ficha técnica</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ficha
                .filter((item) => item.valor)
                .map((item) => (
                  <div key={item.label} className="rounded-xl bg-white p-3 ring-1 ring-black/5">
                    <dt className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <Icon name={item.icon} className="h-4 w-4 text-azul" />
                      {item.label}
                    </dt>
                    <dd className="mt-1 font-semibold text-ink">{item.valor}</dd>
                  </div>
                ))}
            </dl>
          </div>

          {vehicle.opcionais.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Itens e diferenciais</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {vehicle.opcionais.map((o) => (
                  <li
                    key={o}
                    className="flex items-center gap-1.5 rounded-full bg-azul/10 px-3 py-1.5 text-sm font-medium text-azul"
                  >
                    <Icon name="check" className="h-4 w-4" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {vehicle.descricao && (
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Sobre o veículo</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-neutral-600">
                {vehicle.descricao}
              </p>
            </div>
          )}
        </div>
      </div>

      {outros.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold text-ink">Veja também</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {outros.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
