"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LineIcon from "@/components/LineIcon";
import ReviewForm from "@/components/ReviewForm";
import Stars from "@/components/Stars";
import { userDisplay } from "@/components/UserMenu";
import { useAuth } from "@/lib/auth-context";
import { getProductReviews, summarizeReviews, type Review } from "@/lib/reviews";

const STAR_ROWS = [5, 4, 3, 2, 1] as const;

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [sort, setSort] = useState<"recentes" | "nota">("recentes");
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    getProductReviews(productId)
      .then(setReviews)
      .catch(() => setReviews([]));
  };

  useEffect(load, [productId]);

  if (reviews === null) {
    return (
      <section className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:p-6">
        <h2 className="mb-2 text-lg font-bold text-neutral-800">Opiniões do produto</h2>
        <p className="text-sm text-neutral-500">Carregando opiniões...</p>
      </section>
    );
  }

  const summary = summarizeReviews(reviews);
  const myReview = user ? (reviews.find((r) => r.user_id === user.id) ?? null) : null;
  const photos = reviews.filter((r) => r.photo_url);
  const sorted = [...reviews].sort((a, b) =>
    sort === "nota"
      ? b.rating - a.rating
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const { full: myName } = userDisplay(user?.user_metadata, user?.email);

  return (
    <section className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:p-6">
      <h2 className="mb-4 text-lg font-bold text-neutral-800">Opiniões do produto</h2>

      {summary.count === 0 ? (
        <p className="text-neutral-500">
          Esse produto ainda não tem avaliações. Seja a primeira pessoa a avaliar!
        </p>
      ) : (
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-neutral-800">
                {summary.average.toFixed(1)}
              </span>
              <Stars value={summary.average} className="h-5 w-5" />
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              {summary.count} avaliaç{summary.count === 1 ? "ão" : "ões"}
            </p>

            <div className="mt-3 flex flex-col gap-1">
              {STAR_ROWS.map((star) => {
                const c = summary.distribution[star];
                const pct = summary.count ? Math.round((c / summary.count) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="w-2.5 text-right">{star}</span>
                    <LineIcon name="star" filled className="h-3 w-3 text-amber-400" />
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-neutral-400">{c}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {photos.length > 0 && (
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-semibold text-neutral-700">Opiniões com fotos</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {photos.map((r) => (
                  <div
                    key={r.id}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100"
                  >
                    <Image src={r.photo_url!} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
        {reviews.length > 0 ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-500">Ordenar</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "recentes" | "nota")}
              className="rounded-lg border border-neutral-200 px-2 py-1 outline-none focus:border-brand"
            >
              <option value="recentes">Mais recentes</option>
              <option value="nota">Melhor avaliadas</option>
            </select>
          </div>
        ) : (
          <span />
        )}

        {user ? (
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            {myReview ? "Editar sua avaliação" : "Avaliar esse produto"}
          </button>
        ) : (
          <Link href="/entrar" className="text-sm font-semibold text-brand hover:underline">
            Entre pra avaliar esse produto
          </Link>
        )}
      </div>

      {showForm && user && (
        <ReviewForm
          productId={productId}
          userId={user.id}
          defaultName={myName || "Cliente Plavii"}
          existing={myReview}
          onDone={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      {sorted.length > 0 && (
        <ul className="mt-5 flex flex-col divide-y divide-neutral-100 border-t border-neutral-100">
          {sorted.map((r) => (
            <li key={r.id} className="flex gap-3 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                {r.customer_name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-neutral-800">{r.customer_name}</p>
                  <Stars value={r.rating} className="h-3.5 w-3.5" />
                  <span className="text-xs text-neutral-400">
                    {new Date(r.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {r.comment && <p className="mt-1 text-sm text-neutral-600">{r.comment}</p>}
                {r.photo_url && (
                  <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-lg bg-neutral-100">
                    <Image src={r.photo_url} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
