"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { ETAPA_INFO, getLeads, moveLead, whatsappDoCliente } from "@/lib/leads";
import { ETAPAS, type Etapa, type Lead } from "@/lib/types";
import LeadModal from "./LeadModal";

function diasAtras(iso: string): string {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  return `há ${dias} dias`;
}

export default function LeadsBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState<string | null>(null);
  const [sobre, setSobre] = useState<Etapa | null>(null);
  const [modal, setModal] = useState<{ lead: Lead | null; etapa: Etapa } | null>(null);

  const load = () =>
    getLeads()
      .then(setLeads)
      .catch(() => setErro("Não deu pra carregar as negociações."))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const mover = async (lead: Lead, etapa: Etapa) => {
    if (lead.etapa === etapa) return;
    setErro(null);
    setLeads((lista) =>
      lista.map((l) => (l.id === lead.id ? { ...l, etapa, updatedAt: new Date().toISOString() } : l))
    );
    try {
      await moveLead(lead.id, etapa);
    } catch {
      setErro("Não deu pra mover. Tenta de novo.");
      load();
    }
  };

  if (loading) return <p className="text-sm text-neutral-500">Carregando...</p>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          Arraste o cartão pra mudar de etapa (no celular, use as setas).
        </p>
        <button
          type="button"
          onClick={() => setModal({ lead: null, etapa: "novo" })}
          className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Icon name="plus" className="h-4 w-4" />
          Nova negociação
        </button>
      </div>

      {erro && <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{erro}</p>}

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:snap-none md:grid-cols-5 md:overflow-visible md:px-0">
        {ETAPAS.map((etapa, idx) => {
          const info = ETAPA_INFO[etapa];
          const coluna = leads.filter((l) => l.etapa === etapa);
          return (
            <div
              key={etapa}
              onDragOver={(e) => {
                e.preventDefault();
                if (sobre !== etapa) setSobre(etapa);
              }}
              onDragLeave={() => setSobre((s) => (s === etapa ? null : s))}
              onDrop={(e) => {
                e.preventDefault();
                setSobre(null);
                const lead = leads.find((l) => l.id === arrastando);
                setArrastando(null);
                if (lead) mover(lead, etapa);
              }}
              className="flex w-[78vw] shrink-0 snap-start flex-col rounded-2xl bg-neutral-200/50 p-2 transition-shadow sm:w-72 md:w-auto"
              style={{ boxShadow: sobre === etapa ? `inset 0 0 0 2px ${info.color}` : undefined }}
            >
              <div className="flex items-center justify-between px-1.5 pb-2 pt-1">
                <span className="flex items-center gap-2 text-sm font-bold text-ink">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: info.color }} />
                  {info.label}
                </span>
                <span className="text-xs font-semibold text-neutral-400">{coluna.length}</span>
              </div>

              <div className="flex min-h-[96px] flex-1 flex-col gap-2">
                {coluna.map((lead) => {
                  const wa = whatsappDoCliente(lead.telefone);
                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => setArrastando(lead.id)}
                      onDragEnd={() => setArrastando(null)}
                      onClick={() => setModal({ lead, etapa: lead.etapa })}
                      className={`cursor-pointer rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:ring-azul/40 ${
                        arrastando === lead.id ? "opacity-40" : ""
                      }`}
                    >
                      <p className="font-semibold leading-snug text-ink">{lead.nome}</p>
                      {lead.veiculoNome && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-azul">
                          <Icon name="car" className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{lead.veiculoNome}</span>
                        </p>
                      )}
                      {lead.observacao && (
                        <p className="mt-1.5 line-clamp-2 text-xs text-neutral-500">{lead.observacao}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-neutral-400">
                        <span>
                          {lead.origem && <span className="font-medium text-neutral-500">{lead.origem} · </span>}
                          {diasAtras(lead.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          {wa && (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`WhatsApp de ${lead.nome}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-[#128c4a] hover:bg-[#25d366]/10"
                            >
                              <Icon name="whatsapp" className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              mover(lead, ETAPAS[idx - 1]);
                            }}
                            aria-label="Etapa anterior"
                            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-neutral-100 disabled:opacity-0"
                          >
                            <Icon name="chevron-left" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === ETAPAS.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              mover(lead, ETAPAS[idx + 1]);
                            }}
                            aria-label="Próxima etapa"
                            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-neutral-100 disabled:opacity-0"
                          >
                            <Icon name="chevron-right" className="h-4 w-4" />
                          </button>
                        </span>
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setModal({ lead: null, etapa })}
                  className="rounded-xl py-2 text-xs font-semibold text-neutral-400 hover:bg-white/70 hover:text-ink"
                >
                  + Adicionar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <LeadModal
          lead={modal.lead}
          etapaInicial={modal.etapa}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}
    </div>
  );
}
