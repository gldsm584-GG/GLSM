import type { IconName } from "@/components/LineIcon";

export type Category = {
  nome: string;
  slug: string;
  icon: IconName;
  cor: string; // gradiente Tailwind pros cartões da home
};

// Lista oficial de categorias da loja. `nome` é o valor gravado em
// products.category — o admin escolhe daqui, e /categoria/[slug] filtra por ele.
export const CATEGORIES: Category[] = [
  { nome: "Eletrônicos", slug: "eletronicos", icon: "plug", cor: "from-blue-500 to-indigo-600" },
  { nome: "Celulares e Acessórios", slug: "celulares-e-acessorios", icon: "phone", cor: "from-pink-500 to-rose-600" },
  { nome: "Carregadores e Cabos", slug: "carregadores-e-cabos", icon: "battery", cor: "from-emerald-500 to-teal-600" },
  { nome: "Áudio", slug: "audio", icon: "headphones", cor: "from-sky-500 to-cyan-600" },
  { nome: "Informática", slug: "informatica", icon: "laptop", cor: "from-violet-500 to-purple-600" },
  { nome: "Games", slug: "games", icon: "gamepad", cor: "from-fuchsia-500 to-purple-700" },
  { nome: "Smartwatches e Pulseiras", slug: "smartwatches-e-pulseiras", icon: "watch", cor: "from-slate-500 to-slate-700" },
  { nome: "Projetores e TV", slug: "projetores-e-tv", icon: "projector", cor: "from-indigo-500 to-blue-700" },
  { nome: "Utilidades domésticas", slug: "utilidades-domesticas", icon: "home", cor: "from-amber-400 to-orange-500" },
  { nome: "Cozinha", slug: "cozinha", icon: "pan", cor: "from-orange-400 to-red-500" },
  { nome: "Copos e Garrafas", slug: "copos-e-garrafas", icon: "cup", cor: "from-cyan-400 to-blue-500" },
  { nome: "Brinquedos", slug: "brinquedos", icon: "blocks", cor: "from-yellow-400 to-amber-500" },
  { nome: "Bebês e Crianças", slug: "bebes-e-criancas", icon: "smile", cor: "from-rose-300 to-pink-500" },
  { nome: "Beleza e Cuidados", slug: "beleza-e-cuidados", icon: "sparkles", cor: "from-pink-400 to-fuchsia-600" },
  { nome: "Saúde e Bem-estar", slug: "saude-e-bem-estar", icon: "heart", cor: "from-green-400 to-emerald-600" },
  { nome: "Ferramentas", slug: "ferramentas", icon: "wrench", cor: "from-stone-500 to-stone-700" },
  { nome: "Automotivo", slug: "automotivo", icon: "car", cor: "from-red-500 to-rose-700" },
  { nome: "Papelaria e Escritório", slug: "papelaria-e-escritorio", icon: "pencil", cor: "from-lime-400 to-green-600" },
  { nome: "Esportes e Lazer", slug: "esportes-e-lazer", icon: "ball", cor: "from-teal-400 to-cyan-600" },
  { nome: "Pets", slug: "pets", icon: "paw", cor: "from-orange-300 to-amber-600" },
];

// Atalhos que aparecem na barra de categorias (o resto fica no painel "Tudo")
export const QUICK_CATEGORIES = CATEGORIES.filter((c) =>
  [
    "eletronicos",
    "celulares-e-acessorios",
    "audio",
    "informatica",
    "games",
    "utilidades-domesticas",
    "brinquedos",
    "beleza-e-cuidados",
  ].includes(c.slug),
);

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function sameCategory(productCategory: string, category: Category): boolean {
  return normalize(productCategory) === normalize(category.nome);
}
