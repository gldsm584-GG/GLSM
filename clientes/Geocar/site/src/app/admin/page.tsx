"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { ETAPA_INFO, getLeads } from "@/lib/leads";
import { ETAPAS, type Lead, type Vehicle } from "@/lib/types";
import { getAllVehicles } from "@/lib/vehicles";

export default function AdminHomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);

  useEffect(() => {
    getAllVehicles().then(setVehicles).catch(() => setVehicles([]));
    getLeads().then(setLeads).catch(() => setLeads([]));
  }, []);

  const contar = (status: Vehicle["status"]) => vehicles?.filter((v) => v.status === status).length ?? "–";
  const abertas = leads?.filter((l) => l.etapa !== "vendido" && l.etapa !== "perdido").length ?? "–";

  const cards = [
    { label: "À venda", valor: contar("disponivel"), cor: "text-green-600" },
    { label: "Reservados", valor: contar("reservado"), cor: "text-amber-600" },
    { label: "Vendidos", valor: contar("vendido"), cor: "text-neutral-500" },
    { label: "Negociações abertas", valor: abertas, cor: "text-azul" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Painel da Geocar</h1>
      <p className="mt-1 text-sm text-neutral-500">Resumo do estoque e das negociações.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-neutral-500">{c.label}</p>
            <p className={`mt-1 font-display text-3xl font-extrabold ${c.cor}`}>{c.valor}</p>
          </div>
        ))}
      </div>

      {leads && leads.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <p className="font-semibold text-ink">Funil de vendas</p>
          <div className="mt-3 flex flex-col gap-2">
            {ETAPAS.map((etapa) => {
              const n = leads.filter((l) => l.etapa === etapa).length;
              return (
                <div key={etapa} className="flex items-center gap-3 text-sm">
                  <span className="w-36 shrink-0 text-neutral-600">{ETAPA_INFO[etapa].label}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(n / leads.length) * 100}%`,
                        background: ETAPA_INFO[etapa].color,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-semibold text-ink">{n}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/estoque"
          className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:ring-azul"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-azul/10 text-azul">
            <Icon name="car" />
          </span>
          <div>
            <p className="font-semibold text-ink">Estoque</p>
            <p className="mt-0.5 text-sm text-neutral-500">
              Cadastre carros, troque fotos, preço e marque o que foi vendido.
            </p>
          </div>
        </Link>
        <Link
          href="/admin/negociacoes"
          className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:ring-azul"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Icon name="kanban" />
          </span>
          <div>
            <p className="font-semibold text-ink">Negociações</p>
            <p className="mt-0.5 text-sm text-neutral-500">
              Acompanhe cada cliente do primeiro contato até a venda.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
