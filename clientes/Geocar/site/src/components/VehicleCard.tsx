import Image from "next/image";
import Link from "next/link";
import { SEM_FOTO, anoLabel, formatKm, formatPreco, nomeVeiculo } from "@/lib/format";
import type { Vehicle } from "@/lib/types";
import Icon from "./Icon";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const km = formatKm(vehicle.km);

  return (
    <Link
      href={`/carro/${vehicle.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-200">
        {/* Fotos da loja são em pé (3:4) e o carro fica um pouco acima do meio */}
        <Image
          src={vehicle.fotos[0] ?? SEM_FOTO}
          alt={nomeVeiculo(vehicle)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-[center_40%] transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {vehicle.status === "reservado" && (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Reservado
            </span>
          )}
          {vehicle.destaque && vehicle.status !== "reservado" && (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Destaque
            </span>
          )}
        </div>
        {vehicle.fotos.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white">
            {vehicle.fotos.length} fotos
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-azul">
            {vehicle.marca}
          </p>
          <h3 className="mt-0.5 text-lg font-bold leading-snug text-ink">
            {[vehicle.modelo, vehicle.versao].filter(Boolean).join(" ")}
            {vehicle.motor && vehicle.tipo === "carro" && (
              <span className="font-semibold text-neutral-400"> {vehicle.motor}</span>
            )}
          </h3>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
          <span className="flex items-center gap-1.5">
            <Icon name="calendar" className="h-4 w-4 text-neutral-400" />
            {anoLabel(vehicle)}
          </span>
          {km && (
            <span className="flex items-center gap-1.5">
              <Icon name="gauge" className="h-4 w-4 text-neutral-400" />
              {km}
            </span>
          )}
          {vehicle.cambio && (
            <span className="flex items-center gap-1.5">
              <Icon name="gear" className="h-4 w-4 text-neutral-400" />
              {vehicle.cambio}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-neutral-100 pt-3">
          <p
            className={`font-display font-extrabold ${
              vehicle.preco == null ? "text-base text-azul" : "text-xl text-ink"
            }`}
          >
            {vehicle.preco == null ? "Preço sob consulta" : formatPreco(vehicle.preco)}
          </p>
          <span className="flex items-center gap-1 text-sm font-semibold text-brand">
            Ver
            <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
