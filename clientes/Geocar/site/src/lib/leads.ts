import { supabase } from "./supabase";
import type { Etapa, Lead, LeadInput } from "./types";

// Colunas do funil, na ordem do quadro
export const ETAPA_INFO: Record<Etapa, { label: string; color: string }> = {
  novo: { label: "Novo contato", color: "#6b4fb0" },
  negociando: { label: "Em negociação", color: "#d97706" },
  visita: { label: "Test drive / visita", color: "#2563eb" },
  vendido: { label: "Vendido", color: "#16a34a" },
  perdido: { label: "Perdido", color: "#78716c" },
};

type LeadRow = {
  id: string;
  nome: string;
  telefone: string | null;
  veiculo_id: string | null;
  origem: string | null;
  etapa: Etapa;
  observacao: string | null;
  created_at: string;
  updated_at: string;
  veiculos: { marca: string; modelo: string; versao: string | null; ano_modelo: number } | null;
};

function mapRow(row: LeadRow): Lead {
  const v = row.veiculos;
  return {
    id: row.id,
    nome: row.nome,
    telefone: row.telefone ?? "",
    veiculoId: row.veiculo_id,
    veiculoNome: v ? [v.marca, v.modelo, v.versao, v.ano_modelo].filter(Boolean).join(" ") : null,
    origem: row.origem ?? "",
    etapa: row.etapa,
    observacao: row.observacao ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(input: LeadInput) {
  return {
    nome: input.nome.trim(),
    telefone: input.telefone.trim() || null,
    veiculo_id: input.veiculoId,
    origem: input.origem || null,
    etapa: input.etapa,
    observacao: input.observacao.trim() || null,
  };
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("negociacoes")
    .select("*, veiculos(marca, modelo, versao, ano_modelo)")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as LeadRow));
}

export async function createLead(input: LeadInput): Promise<void> {
  const { error } = await supabase.from("negociacoes").insert(toRow(input));
  if (error) throw error;
}

export async function updateLead(id: string, input: LeadInput): Promise<void> {
  const { error } = await supabase
    .from("negociacoes")
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function moveLead(id: string, etapa: Etapa): Promise<void> {
  const { error } = await supabase
    .from("negociacoes")
    .update({ etapa, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from("negociacoes").delete().eq("id", id);
  if (error) throw error;
}

// Link pra abrir a conversa com o cliente (aceita DDD + número)
export function whatsappDoCliente(telefone: string): string | null {
  const digits = telefone.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `https://wa.me/55${digits}`;
  if (digits.length >= 12 && digits.startsWith("55")) return `https://wa.me/${digits}`;
  return null;
}
