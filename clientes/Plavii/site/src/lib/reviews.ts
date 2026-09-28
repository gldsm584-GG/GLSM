import { supabase } from "./supabase";

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  photo_url: string | null;
  created_at: string;
};

export type ReviewSummary = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Review[];
}

export function summarizeReviews(reviews: Review[]): ReviewSummary {
  const distribution: ReviewSummary["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    const star = r.rating as 1 | 2 | 3 | 4 | 5;
    if (distribution[star] !== undefined) distribution[star] += 1;
  }
  const count = reviews.length;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { average: count ? sum / count : 0, count, distribution };
}

// Envia a foto na pasta do próprio cliente (exigido pela policy do bucket)
export async function uploadReviewPhoto(userId: string, file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("avaliacoes")
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) throw error;

  return supabase.storage.from("avaliacoes").getPublicUrl(path).data.publicUrl;
}

// Uma avaliação por cliente por produto — enviar de novo atualiza a mesma
export async function submitReview(input: {
  productId: string;
  userId: string;
  customerName: string;
  rating: number;
  comment: string;
  photoUrl?: string | null;
}): Promise<void> {
  const { error } = await supabase.from("reviews").upsert(
    {
      product_id: input.productId,
      user_id: input.userId,
      customer_name: input.customerName,
      rating: input.rating,
      comment: input.comment.trim() || null,
      photo_url: input.photoUrl ?? null,
    },
    { onConflict: "product_id,user_id" }
  );
  if (error) throw error;
}

export async function deleteReview(productId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", userId);
  if (error) throw error;
}
