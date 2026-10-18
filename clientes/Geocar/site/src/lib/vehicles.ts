import { ESTOQUE_INICIAL } from "./estoque-inicial";
import { supabase, supabaseConfigured } from "./supabase";
import type { Vehicle, VehicleInput, VehicleStatus, VehicleType } from "./types";

type VehicleRow = {
  id: string;
  slug: string;
  tipo: VehicleType;
  marca: string;
  modelo: string;
  versao: string | null;
  ano_fabricacao: number | null;
  ano_modelo: number;
  km: number | null;
  cambio: string | null;
  combustivel: string | null;
  cor: string | null;
  motor: string | null;
  preco: number | null;
  status: VehicleStatus;
  destaque: boolean;
  opcionais: string[] | null;
  descricao: string | null;
  fotos: string[] | null;
  created_at: string;
};

function safeSrc(src: string): string | null {
  const value = src.trim();
  return value.startsWith("/") || /^https:\/\//i.test(value) ? value : null;
}

function mapRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    tipo: row.tipo,
    marca: row.marca,
    modelo: row.modelo,
    versao: row.versao ?? "",
    anoFabricacao: row.ano_fabricacao,
    anoModelo: row.ano_modelo,
    km: row.km,
    cambio: row.cambio ?? "",
    combustivel: row.combustivel ?? "",
    cor: row.cor ?? "",
    motor: row.motor ?? "",
    preco: row.preco != null ? Number(row.preco) : null,
    status: row.status,
    destaque: row.destaque,
    opcionais: row.opcionais ?? [],
    descricao: row.descricao ?? "",
    fotos: (row.fotos ?? []).map(safeSrc).filter((s): s is string => s !== null),
    createdAt: row.created_at,
  };
}

function toRow(input: VehicleInput) {
  return {
    slug: input.slug,
    tipo: input.tipo,
    marca: input.marca,
    modelo: input.modelo,
    versao: input.versao || null,
    ano_fabricacao: input.anoFabricacao,
    ano_modelo: input.anoModelo,
    km: input.km,
    cambio: input.cambio || null,
    combustivel: input.combustivel || null,
    cor: input.cor || null,
    motor: input.motor || null,
    preco: input.preco,
    status: input.status,
    destaque: input.destaque,
    opcionais: input.opcionais,
    descricao: input.descricao || null,
    fotos: input.fotos,
  };
}

// Modo demonstração (sem Supabase): o estoque inicial, na ordem dos posts
function demoVehicles(): Vehicle[] {
  return ESTOQUE_INICIAL.map(({ postadoEm, ...v }) => ({
    ...v,
    id: v.slug,
    createdAt: `${postadoEm}T12:00:00Z`,
  }));
}

// Destaques primeiro, depois os mais recentes
function sortVitrine(list: Vehicle[]): Vehicle[] {
  return [...list].sort(
    (a, b) =>
      Number(b.destaque) - Number(a.destaque) || b.createdAt.localeCompare(a.createdAt)
  );
}

// Vitrine: tudo menos o que já foi vendido
export async function getVitrine(): Promise<Vehicle[]> {
  if (!supabaseConfigured) return sortVitrine(demoVehicles());
  const { data, error } = await supabase
    .from("veiculos")
    .select("*")
    .neq("status", "vendido")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return sortVitrine((data ?? []).map(mapRow));
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
  if (!supabaseConfigured) return demoVehicles().find((v) => v.slug === slug);
  const { data, error } = await supabase
    .from("veiculos")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : undefined;
}

export async function getOutros(vehicle: Vehicle, limit = 4): Promise<Vehicle[]> {
  const todos = await getVitrine();
  const outros = todos.filter((v) => v.id !== vehicle.id);
  // Mesmo tipo (carro/moto) primeiro
  return [
    ...outros.filter((v) => v.tipo === vehicle.tipo),
    ...outros.filter((v) => v.tipo !== vehicle.tipo),
  ].slice(0, limit);
}

// --- Painel (só funciona com Supabase e login de admin) -------------------

export async function getAllVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("veiculos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function createVehicle(input: VehicleInput): Promise<void> {
  const { error } = await supabase.from("veiculos").insert(toRow(input));
  if (error) throw error;
}

async function saveRow(id: string, row: Record<string, unknown>): Promise<void> {
  const { data, error } = await supabase
    .from("veiculos")
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  // Com RLS bloqueando, o Supabase não dá erro: só atualiza 0 linhas.
  if (!data || data.length === 0) throw new Error("NO_PERMISSION");
}

export async function updateVehicle(id: string, input: VehicleInput): Promise<void> {
  await saveRow(id, toRow(input));
}

// Atalhos da lista do painel (sem abrir o formulário)
export async function patchVehicle(
  id: string,
  patch: { status?: VehicleStatus; destaque?: boolean }
): Promise<void> {
  await saveRow(id, patch);
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabase.from("veiculos").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadVehiclePhoto(file: Blob, extension = "jpg"): Promise<string> {
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("veiculos")
    .upload(path, file, { contentType: file.type || "image/jpeg", cacheControl: "31536000" });
  if (error) throw error;
  return supabase.storage.from("veiculos").getPublicUrl(path).data.publicUrl;
}
