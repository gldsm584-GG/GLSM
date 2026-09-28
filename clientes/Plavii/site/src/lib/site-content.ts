import { supabase } from "./supabase";

export type SitePage = {
  slug: string;
  title: string;
  content: string;
  image_url: string | null;
  updated_at: string;
};

export async function getSitePage(slug: string): Promise<SitePage | null> {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as SitePage | null;
}

// As duas páginas em branco que aparecem no rodapé (a "hero" não entra aqui)
export async function getFooterPages(): Promise<SitePage[]> {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .in("slug", ["pagina-1", "pagina-2"])
    .order("slug");
  if (error) throw error;
  return (data ?? []) as SitePage[];
}

export async function updateSitePage(
  slug: string,
  input: { title?: string; content?: string; image_url?: string | null }
): Promise<void> {
  const { data, error } = await supabase
    .from("site_pages")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select("slug");
  if (error) throw error;
  // Com RLS bloqueando, o Supabase não dá erro: só atualiza 0 linhas.
  if (!data || data.length === 0) throw new Error("NO_PERMISSION");
}

export async function uploadSiteImage(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("site")
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) throw error;

  return supabase.storage.from("site").getPublicUrl(path).data.publicUrl;
}
