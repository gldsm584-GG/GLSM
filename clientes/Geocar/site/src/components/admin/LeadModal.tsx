"use client";

import { type FormEvent, useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { anoLabel, nomeVeiculo } from "@/lib/format";
import { ETAPA_INFO, createLead, deleteLead, updateLead } from "@/lib/leads";
import { ETAPAS, ORIGENS, type Etapa, type Lead, type LeadInput, type Vehicle } from "@/lib/types";
import { getAllVehicles } from "@/lib/vehicles";

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-azul";

export default function LeadModal({
  lead,
  etapaInicial = "novo",
  onClose,
  onSaved,
}: {
  lead: Lead | null;
  etapaInicial?: Etapa;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<LeadInput>(
    lead
      ? {
          nome: lead.nome,
          telefone: lead.telefone,
          veiculoId: lead.veiculoId,
          origem: lead.origem,
          etapa: lead.etapa,
          observacao: lead.observacao,
        }
      : { nome: "", telefone: "", veiculoId: null, origem: "WhatsApp", etapa: etapaInicial, observacao: "" }
  );
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllVehicles().then(setVehicles).catch(() => setVehicles([]));
  }, []);

  // Fecha com Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = <K extends keyof LeadInput>(key: K, value: LeadInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Vendidos só aparecem se já estavam ligados a essa negociação
  const opcoes = vehicles.filter((v) => v.status !== "vendido" || v.id === form.veiculoId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      setError("Coloca pelo menos o nome do cliente.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (lead) await updateLead(lead.id, form);
      else await createLead(form);
      onSaved();
    } catch {
      setError("Não deu pra salvar. Tenta de novo.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lead || !confirm(`Apagar a negociação com ${lead.nome}?`)) return;
    await deleteLead(lead.id);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">
            {lead ? "Negociação" : "Nova negociação"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-ink"
          >
            <Icon name="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
              Cliente *
              <input value={form.nome} onChange={(e) => set("nome", e.target.value)} className={inputClass} placeholder="Nome" autoFocus />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
              Telefone / WhatsApp
              <input value={form.telefone} onChange={(e) => set("telefone", e.target.value)} className={inputClass} placeholder="(61) 99999-9999" inputMode="tel" />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
            Veículo de interesse
            <select
              value={form.veiculoId ?? ""}
              onChange={(e) => set("veiculoId", e.target.value || null)}
              className={inputClass}
            >
              <option value="">Ainda não escolheu</option>
              {opcoes.map((v) => (
                <option key={v.id} value={v.id}>
                  {nomeVeiculo(v)} {anoLabel(v)}
                  {v.status === "vendido" ? " (vendido)" : ""}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
              Como chegou
              <select value={form.origem} onChange={(e) => set("origem", e.target.value)} className={inputClass}>
                {ORIGENS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
              Etapa
              <select value={form.etapa} onChange={(e) => set("etapa", e.target.value as Etapa)} className={inputClass}>
                {ETAPAS.map((etapa) => (
                  <option key={etapa} value={etapa}>
                    {ETAPA_INFO[etapa].label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
            Anotações
            <textarea
              rows={4}
              value={form.observacao}
              onChange={(e) => set("observacao", e.target.value)}
              className={inputClass}
              placeholder="Ex.: quer dar um Gol 2012 na troca, entrada de R$ 10 mil, voltar a ligar sexta"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-1 flex items-center gap-2">
            {lead && (
              <button
                type="button"
                onClick={handleDelete}
                className="mr-auto flex items-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Icon name="trash" className="h-4 w-4" />
                Apagar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 ${lead ? "" : "ml-auto"}`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
