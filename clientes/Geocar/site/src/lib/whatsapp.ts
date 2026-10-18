import { anoLabel, nomeVeiculo } from "./format";
import type { Vehicle } from "./types";

// Números do Linktree da Geocar (levantados em 2026-10-12). São números
// reais da loja — não testar os botões sem avisar.
export const VENDEDORES = [
  { nome: "George", numero: "5561981153066", exibicao: "(61) 98115-3066" },
  { nome: "Diógenes", numero: "5561982045568", exibicao: "(61) 98204-5568" },
] as const;

export function linkWhatsapp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function mensagemInteresse(v: Vehicle, url?: string): string {
  return [
    `Olá! Vi no site o ${nomeVeiculo(v)} ${anoLabel(v)} e tenho interesse.`,
    ...(url ? [url] : []),
  ].join("\n");
}

export function mensagemFinanciamento(v: Vehicle, url?: string): string {
  return [
    `Olá! Quero simular o financiamento do ${nomeVeiculo(v)} ${anoLabel(v)}.`,
    ...(url ? [url] : []),
  ].join("\n");
}
