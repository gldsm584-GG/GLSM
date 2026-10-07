import { supabase } from "./supabase";
import type { Product } from "./types";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  volume_ml: number;
  price: number;
  old_price: number | null;
  image: string;
  images: string[] | null;
  description: string | null;
  notes_top: string | null;
  notes_heart: string | null;
  notes_base: string | null;
};

const NO_IMAGE = "/sem-imagem.svg";

function safeImageSrc(src: string | null): string {
  const value = (src ?? "").trim().replace(/^["']|["']$/g, "");
  return value.startsWith("/") || /^https?:\/\//i.test(value) ? value : NO_IMAGE;
}

function safeImageList(images: string[] | null, cover: string): string[] {
  const list = (images ?? [])
    .map(safeImageSrc)
    .filter((src, i, arr) => src !== NO_IMAGE && arr.indexOf(src) === i);
  return list.length > 0 ? list : [cover];
}

function mapRow(row: ProductRow): Product {
  const image = safeImageSrc(row.image);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    volumeMl: row.volume_ml,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    image,
    images: safeImageList(row.images, image),
    description: row.description ?? "",
    notesTop: row.notes_top ?? "",
    notesHeart: row.notes_heart ?? "",
    notesBase: row.notes_base ?? "",
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : undefined;
}

export async function getOtherProducts(product: Product, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .neq("id", product.id)
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export type ProductInput = {
  id: string;
  slug: string;
  name: string;
  volumeMl: number;
  price: number;
  oldPrice?: number;
  images: string[];
  description: string;
  notesTop: string;
  notesHeart: string;
  notesBase: string;
};

export async function createProduct(input: ProductInput): Promise<void> {
  const { error } = await supabase.from("products").insert({
    id: input.id,
    slug: input.slug,
    name: input.name,
    volume_ml: input.volumeMl,
    price: input.price,
    old_price: input.oldPrice ?? null,
    image: input.images[0] ?? "",
    images: input.images,
    description: input.description,
    notes_top: input.notesTop,
    notes_heart: input.notesHeart,
    notes_base: input.notesBase,
  });
  if (error) throw error;
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  const { data, error } = await supabase
    .from("products")
    .update({
      slug: input.slug,
      name: input.name,
      volume_ml: input.volumeMl,
      price: input.price,
      old_price: input.oldPrice ?? null,
      image: input.images[0] ?? "",
      images: input.images,
      description: input.description,
      notes_top: input.notesTop,
      notes_heart: input.notesHeart,
      notes_base: input.notesBase,
    })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  // Com RLS bloqueando, o Supabase não dá erro: só atualiza 0 linhas.
  if (!data || data.length === 0) throw new Error("NO_PERMISSION");
}

export async function uploadProductImage(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("produtos")
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) throw error;

  return supabase.storage.from("produtos").getPublicUrl(path).data.publicUrl;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function discountPercent(product: Product): number | null {
  if (!product.oldPrice || product.oldPrice <= product.price) return null;
  return Math.round(100 - (product.price / product.oldPrice) * 100);
}
