import { supabase } from "./supabase";

export type HeroButton = {
  id: string;
  text: string;
  link: string | null;
  text_color: string;
  bg_color: string;
  x: number; // % da largura da imagem, a partir da esquerda
  y: number; // % da altura da imagem, a partir do topo
};

export type HeroSlide = {
  id: string;
  image_url: string;
  buttons: HeroButton[];
  created_at: string;
};

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as HeroSlide[];
}

export async function addHeroSlide(imageUrl: string): Promise<void> {
  const { data, error } = await supabase
    .from("hero_slides")
    .insert({ image_url: imageUrl })
    .select("id");
  if (error) throw error;
  // Com RLS bloqueando, o Supabase não dá erro: só insere 0 linhas.
  if (!data || data.length === 0) throw new Error("NO_PERMISSION");
}

export async function updateHeroSlideButtons(
  id: string,
  buttons: HeroButton[]
): Promise<void> {
  const { data, error } = await supabase
    .from("hero_slides")
    .update({ buttons })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("NO_PERMISSION");
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) throw error;
}
