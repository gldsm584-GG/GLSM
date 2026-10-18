"use client";

import { useMemo, useState } from "react";
import { nomeVeiculo } from "@/lib/format";
import type { Vehicle, VehicleType } from "@/lib/types";
import { VENDEDORES, linkWhatsapp } from "@/lib/whatsapp";
import Icon from "./Icon";
import VehicleCard from "./VehicleCard";

type Ordem = "destaques" | "recentes" | "ano-desc" | "ano-asc" | "preco-asc" | "preco-desc";

const ORDENS: { value: Ordem; label: string; precisaPreco?: boolean }[] = [
  { value: "destaques", label: "Destaques" },
  { value: "recentes", label: "Chegaram agora" },
  { value: "ano-desc", label: "Mais novos" },
  { value: "ano-asc", label: "Mais antigos" },
  { value: "preco-asc", label: "Menor preço", precisaPreco: true },
  { value: "preco-desc", label: "Maior preço", precisaPreco: true },
];

const selectClass =
  "w-full min-w-0 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-azul";

function ordenar(lista: Vehicle[], ordem: Ordem): Vehicle[] {
  const copia = [...lista];
  switch (ordem) {
    case "recentes":
      return copia.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "ano-desc":
      return copia.sort((a, b) => b.anoModelo - a.anoModelo);
    case "ano-asc":
      return copia.sort((a, b) => a.anoModelo - b.anoModelo);
    // Sem preço vai pro fim nas duas ordens de preço
    case "preco-asc":
      return copia.sort((a, b) => (a.preco ?? Infinity) - (b.preco ?? Infinity));
    case "preco-desc":
      return copia.sort((a, b) => (b.preco ?? -Infinity) - (a.preco ?? -Infinity));
    default:
      return copia; // já vem com destaques primeiro
  }
}

export default function EstoqueGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState<VehicleType | "todos">("todos");
  const [marca, setMarca] = useState("");
  const [cambio, setCambio] = useState("");
  const [anoMin, setAnoMin] = useState(0);
  const [ordem, setOrdem] = useState<Ordem>("destaques");

  const marcas = useMemo(
    () => [...new Set(vehicles.map((v) => v.marca))].sort((a, b) => a.localeCompare(b)),
    [vehicles]
  );
  const cambios = useMemo(
    () => [...new Set(vehicles.map((v) => v.cambio).filter(Boolean))].sort(),
    [vehicles]
  );
  const anos = useMemo(() => {
    const lista = vehicles.map((v) => v.anoModelo);
    if (lista.length === 0) return [];
    const min = Math.min(...lista);
    const max = Math.max(...lista);
    // Degraus de 5 em 5 anos entre o mais antigo e o mais novo
    const degraus: number[] = [];
    for (let ano = Math.ceil(min / 5) * 5; ano <= max; ano += 5) degraus.push(ano);
    return degraus;
  }, [vehicles]);
  const temMotos = vehicles.some((v) => v.tipo === "moto");
  const temPreco = vehicles.some((v) => v.preco != null);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return ordenar(
      vehicles.filter(
        (v) =>
          (tipo === "todos" || v.tipo === tipo) &&
          (!marca || v.marca === marca) &&
          (!cambio || v.cambio === cambio) &&
          v.anoModelo >= anoMin &&
          (!termo || `${nomeVeiculo(v)} ${v.anoModelo} ${v.cor}`.toLowerCase().includes(termo))
      ),
      ordem
    );
  }, [vehicles, busca, tipo, marca, cambio, anoMin, ordem]);

  const temFiltro = busca || tipo !== "todos" || marca || cambio || anoMin;
  const limpar = () => {
    setBusca("");
    setTipo("todos");
    setMarca("");
    setCambio("");
    setAnoMin(0);
  };

  return (
    <div>
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <label className="relative col-span-2 lg:col-span-1">
            <span className="sr-only">Buscar</span>
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar marca, modelo ou ano"
              className={`${selectClass} pl-9`}
            />
          </label>
          <label>
            <span className="sr-only">Marca</span>
            <select value={marca} onChange={(e) => setMarca(e.target.value)} className={selectClass}>
              <option value="">Marca</option>
              {marcas.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Câmbio</span>
            <select value={cambio} onChange={(e) => setCambio(e.target.value)} className={selectClass}>
              <option value="">Câmbio</option>
              {cambios.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Ano</span>
            <select
              value={anoMin}
              onChange={(e) => setAnoMin(Number(e.target.value))}
              className={selectClass}
            >
              <option value={0}>Ano</option>
              {anos.map((a) => (
                <option key={a} value={a}>
                  Desde {a}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Ordenar</span>
            <select
              value={ordem}
              onChange={(e) => setOrdem(e.target.value as Ordem)}
              className={selectClass}
            >
              {ORDENS.filter((o) => !o.precisaPreco || temPreco).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          {temMotos ? (
            <div className="flex gap-1 rounded-full bg-neutral-100 p-1">
              {(
                [
                  ["todos", "Todos"],
                  ["carro", "Carros"],
                  ["moto", "Motos"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTipo(value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    tipo === value ? "bg-ink text-white" : "text-neutral-500 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span>
              {filtrados.length} {filtrados.length === 1 ? "veículo" : "veículos"}
            </span>
            {temFiltro ? (
              <button
                type="button"
                onClick={limpar}
                className="font-semibold text-brand hover:underline"
              >
                Limpar filtros
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {filtrados.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
          <p className="font-display text-lg font-bold text-ink">Nenhum veículo com esses filtros</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500">
            O estoque muda toda semana. Conta pra gente o que você procura que a
            gente avisa quando chegar.
          </p>
          <a
            href={linkWhatsapp(
              VENDEDORES[0].numero,
              "Olá! Estou procurando um carro e não achei no site. Vocês podem me avisar quando chegar?"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            Avisar quando chegar
          </a>
        </div>
      )}
    </div>
  );
}
