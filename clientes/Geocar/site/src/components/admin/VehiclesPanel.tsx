"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { SEM_FOTO, anoLabel, formatPreco, nomeVeiculo } from "@/lib/format";
import type { Vehicle, VehicleStatus } from "@/lib/types";
import { deleteVehicle, getAllVehicles, patchVehicle } from "@/lib/vehicles";
import VehicleForm from "./VehicleForm";

const FILTROS: { value: VehicleStatus | "todos"; label: string }[] = [
  { value: "disponivel", label: "À venda" },
  { value: "reservado", label: "Reservados" },
  { value: "vendido", label: "Vendidos" },
  { value: "todos", label: "Todos" },
];

const STATUS_CLASS: Record<VehicleStatus, string> = {
  disponivel: "bg-green-50 text-green-700 ring-green-200",
  reservado: "bg-amber-50 text-amber-700 ring-amber-200",
  vendido: "bg-neutral-100 text-neutral-500 ring-neutral-200",
};

export default function VehiclesPanel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<VehicleStatus | "todos">("disponivel");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const load = () =>
    getAllVehicles()
      .then(setVehicles)
      .catch(() => setErro("Não deu pra carregar o estoque."))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const patch = async (v: Vehicle, mudanca: { status?: VehicleStatus; destaque?: boolean }) => {
    setErro(null);
    setVehicles((lista) => lista.map((x) => (x.id === v.id ? { ...x, ...mudanca } : x)));
    try {
      await patchVehicle(v.id, mudanca);
    } catch {
      setErro("Não deu pra salvar a alteração.");
      load();
    }
  };

  const apagar = async (v: Vehicle) => {
    if (!confirm(`Apagar "${nomeVeiculo(v)} ${anoLabel(v)}"? Não dá pra desfazer.\n\nSe ele foi vendido, prefira marcar como "Vendido".`)) return;
    await deleteVehicle(v.id);
    load();
  };

  const fechar = () => {
    setShowForm(false);
    setEditing(null);
  };

  if (showForm) {
    return (
      <VehicleForm
        editing={editing}
        onCancel={fechar}
        onDone={() => {
          fechar();
          load();
        }}
      />
    );
  }

  const lista = vehicles.filter((v) => filtro === "todos" || v.status === filtro);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-full bg-white p-1 ring-1 ring-black/5">
          {FILTROS.map((f) => {
            const n = f.value === "todos" ? vehicles.length : vehicles.filter((v) => v.status === f.value).length;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFiltro(f.value)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  filtro === f.value ? "bg-ink text-white" : "text-neutral-500 hover:text-ink"
                }`}
              >
                {f.label} <span className="opacity-60">{n}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Icon name="plus" className="h-4 w-4" />
          Novo veículo
        </button>
      </div>

      {erro && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{erro}</p>}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando...</p>
      ) : lista.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-400">
          Nenhum veículo aqui.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((v) => (
            <div
              key={v.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5"
            >
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                <Image src={v.fotos[0] ?? SEM_FOTO} alt="" fill sizes="64px" className="object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">
                  {nomeVeiculo(v)} {anoLabel(v)}
                </p>
                <p className="text-sm text-neutral-500">
                  {formatPreco(v.preco)} · {v.fotos.length} fotos
                </p>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => patch(v, { destaque: !v.destaque })}
                  aria-label={v.destaque ? "Tirar dos destaques" : "Colocar nos destaques"}
                  title={v.destaque ? "Tirar dos destaques" : "Colocar nos destaques"}
                  className={`flex h-9 w-9 items-center justify-center rounded-full ring-1 transition-colors ${
                    v.destaque ? "bg-brand text-white ring-brand" : "text-neutral-400 ring-neutral-200 hover:text-brand"
                  }`}
                >
                  <Icon name="star" className="h-4 w-4" />
                </button>
                <select
                  value={v.status}
                  onChange={(e) => patch(v, { status: e.target.value as VehicleStatus })}
                  aria-label="Situação"
                  className={`rounded-full px-3 py-2 text-sm font-semibold ring-1 outline-none ${STATUS_CLASS[v.status]}`}
                >
                  <option value="disponivel">À venda</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(v);
                    setShowForm(true);
                  }}
                  className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-azul ring-1 ring-neutral-200 hover:bg-azul/5"
                >
                  <Icon name="edit" className="h-4 w-4" />
                  Editar
                </button>
                <Link
                  href={`/carro/${v.slug}`}
                  target="_blank"
                  aria-label="Ver no site"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 ring-1 ring-neutral-200 hover:text-ink"
                >
                  <Icon name="eye" className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => apagar(v)}
                  aria-label="Apagar"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 ring-1 ring-neutral-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
