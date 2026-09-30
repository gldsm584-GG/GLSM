import type { IconName } from "@/components/LineIcon";
import { supabase } from "./supabase";

export type Category = {
  id: string;
  nome: string;
  slug: string;
  icon: IconName;
  cor: string; // gradiente Tailwind pros cartões da home
};

// Combinações de cor prontas pro admin escolher ao criar uma categoria.
// Precisa ser uma lista fixa aqui no código (não vinda do banco) porque o
// Tailwind só gera o CSS das classes que ele enxerga nos arquivos — uma
// cor digitada livremente em tempo de execução não funcionaria.
export const COLOR_PRESETS = [
  "from-blue-500 to-indigo-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-cyan-600",
  "from-violet-500 to-purple-600",
  "from-fuchsia-500 to-purple-700",
  "from-slate-500 to-slate-700",
  "from-indigo-500 to-blue-700",
  "from-amber-400 to-orange-500",
  "from-orange-400 to-red-500",
  "from-cyan-400 to-blue-500",
  "from-yellow-400 to-amber-500",
  "from-rose-300 to-pink-500",
  "from-pink-400 to-fuchsia-600",
  "from-green-400 to-emerald-600",
  "from-stone-500 to-stone-700",
  "from-red-500 to-rose-700",
  "from-lime-400 to-green-600",
  "from-teal-400 to-cyan-600",
  "from-orange-300 to-amber-600",
] as const;

type CategoryRow = {
  id: string;
  nome: string;
  slug: string;
  icon: string;
  cor: string;
};

function mapRow(row: CategoryRow): Category {
  return { id: row.id, nome: row.nome, slug: row.slug, icon: row.icon as IconName, cor: row.cor };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("created_at");
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : undefined;
}

export type CategoryInput = { nome: string; slug: string; icon: IconName; cor: string };

export async function addCategory(input: CategoryInput): Promise<void> {
  const { data, error } = await supabase.from("categories").insert(input).select("id");
  if (error) throw error;
  // Com RLS bloqueando, o Supabase não dá erro: só insere 0 linhas.
  if (!data || data.length === 0) throw new Error("NO_PERMISSION");
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

export function sameCategory(productCategory: string, category: Category): boolean {
  return normalize(productCategory) === normalize(category.nome);
}
