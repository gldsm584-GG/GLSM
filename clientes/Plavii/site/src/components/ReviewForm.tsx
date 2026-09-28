"use client";

import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";
import LineIcon from "@/components/LineIcon";
import { deleteReview, submitReview, uploadReviewPhoto, type Review } from "@/lib/reviews";

export default function ReviewForm({
  productId,
  userId,
  defaultName,
  existing,
  onDone,
}: {
  productId: string;
  userId: string;
  defaultName: string;
  existing: Review | null;
  onDone: () => void;
}) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(existing?.photo_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Escolhe um arquivo de imagem (JPG, PNG ou WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("A foto tem mais de 5 MB. Escolhe uma menor.");
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const url = await uploadReviewPhoto(userId, file);
      setPhotoUrl(url);
    } catch {
      setError("Não deu pra enviar a foto. Tenta de novo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (rating === 0) {
      setError("Escolhe uma nota de 1 a 5 estrelas.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await submitReview({
        productId,
        userId,
        customerName: defaultName,
        rating,
        comment,
        photoUrl,
      });
      onDone();
    } catch {
      setError("Não deu pra salvar sua avaliação. Tenta de novo em instantes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apagar sua avaliação desse produto?")) return;
    setSaving(true);
    try {
      await deleteReview(productId, userId);
      onDone();
    } catch {
      setError("Não deu pra apagar. Tenta de novo.");
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-4 rounded-xl border border-neutral-200 p-4"
    >
      <div>
        <p className="mb-1 text-sm font-medium text-neutral-700">Sua nota</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(n)}
              aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
              className="text-amber-400 transition-transform hover:scale-110"
            >
              <LineIcon name="star" filled={n <= (hoverRating || rating)} className="h-7 w-7" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="review-comment" className="text-sm font-medium text-neutral-700">
          Comentário (opcional)
        </label>
        <textarea
          id="review-comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Conta como foi sua experiência com o produto"
          className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-700">Foto (opcional)</label>
        <div className="flex items-center gap-3">
          {photoUrl && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
              <Image src={photoUrl} alt="" fill sizes="64px" className="object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handlePhoto}
            disabled={uploading}
            className="text-sm text-neutral-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/20"
          />
        </div>
        {uploading && <p className="text-xs text-neutral-400">Enviando foto...</p>}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? "Salvando..." : existing ? "Salvar alterações" : "Publicar avaliação"}
        </button>
        {existing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="rounded-full px-5 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-60"
          >
            Apagar avaliação
          </button>
        )}
      </div>
    </form>
  );
}
