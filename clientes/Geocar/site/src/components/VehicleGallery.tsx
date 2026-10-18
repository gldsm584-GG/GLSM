"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SEM_FOTO } from "@/lib/format";
import Icon from "./Icon";

export default function VehicleGallery({ fotos, alt }: { fotos: string[]; alt: string }) {
  const lista = fotos.length > 0 ? fotos : [SEM_FOTO];
  const [atual, setAtual] = useState(0);
  const [tela, setTela] = useState(false);
  const toqueX = useRef<number | null>(null);
  const thumbs = useRef<HTMLDivElement>(null);

  const ir = useCallback(
    (passo: number) => setAtual((i) => (i + passo + lista.length) % lista.length),
    [lista.length]
  );

  // Setas do teclado e Esc (tela cheia)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
      if (e.key === "Escape") setTela(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ir]);

  // Mantém a miniatura ativa visível
  useEffect(() => {
    const el = thumbs.current?.children[atual] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [atual]);

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => (toqueX.current = e.touches[0].clientX),
    onTouchEnd: (e: React.TouchEvent) => {
      if (toqueX.current == null) return;
      const dx = e.changedTouches[0].clientX - toqueX.current;
      if (Math.abs(dx) > 40) ir(dx < 0 ? 1 : -1);
      toqueX.current = null;
    },
  };

  const setas = lista.length > 1 && (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          ir(-1);
        }}
        aria-label="Foto anterior"
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/70"
      >
        <Icon name="chevron-left" className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          ir(1);
        }}
        aria-label="Próxima foto"
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/70"
      >
        <Icon name="chevron-right" className="h-6 w-6" />
      </button>
    </>
  );

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-2xl bg-neutral-200 md:aspect-[3/4]"
        onClick={() => setTela(true)}
        {...swipe}
      >
        <Image
          src={lista[atual]}
          alt={`${alt} — foto ${atual + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover object-[center_40%]"
        />
        {setas}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
          {atual + 1} / {lista.length}
        </span>
      </div>

      {lista.length > 1 && (
        <div ref={thumbs} className="flex gap-2 overflow-x-auto pb-1">
          {lista.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setAtual(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg transition ${
                i === atual ? "ring-2 ring-brand" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {tela && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setTela(false)}
          {...swipe}
        >
          <div className="relative h-full w-full max-w-3xl">
            <Image
              src={lista[atual]}
              alt={`${alt} — foto ${atual + 1}`}
              fill
              sizes="100vw"
              quality={85}
              className="object-contain"
            />
            {setas}
          </div>
          <button
            type="button"
            onClick={() => setTela(false)}
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <Icon name="close" className="h-6 w-6" />
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {atual + 1} / {lista.length}
          </span>
        </div>
      )}
    </div>
  );
}
