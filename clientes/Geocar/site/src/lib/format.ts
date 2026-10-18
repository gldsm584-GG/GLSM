import type { Vehicle } from "./types";

export const SEM_FOTO = "/sem-foto.svg";

export function nomeVeiculo(v: Pick<Vehicle, "marca" | "modelo" | "versao">): string {
  return [v.marca, v.modelo, v.versao].filter(Boolean).join(" ");
}

export function anoLabel(v: Pick<Vehicle, "anoFabricacao" | "anoModelo">): string {
  return v.anoFabricacao && v.anoFabricacao !== v.anoModelo
    ? `${v.anoFabricacao}/${v.anoModelo}`
    : String(v.anoModelo);
}

export function formatPreco(valor: number | null): string {
  if (valor == null) return "Consulte";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatKm(km: number | null): string | null {
  if (km == null) return null;
  return `${km.toLocaleString("pt-BR")} km`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function soDigitos(text: string): string {
  return text.replace(/\D/g, "");
}

export function formatData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
