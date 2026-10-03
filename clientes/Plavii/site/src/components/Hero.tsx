"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LineIcon from "@/components/LineIcon";
import { formatPrice } from "@/lib/products";
import type { HeroSlide } from "@/lib/hero";
import type { Product } from "@/lib/types";

export default function Hero({
  slides,
  destaques,
}: {
  slides: HeroSlide[];
  destaques: Product[];
}) {
  if (slides.length === 0) {
    return <DefaultHero destaques={destaques} />;
  }

  if (slides.length === 1) {
    return (
      <section className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 sm:aspect-[16/9] md:aspect-[21/9]">
        <Image src={slides[0].image_url} alt="Plavii" fill priority className="object-cover" sizes="100vw" />
        <HeroButtons slide={slides[0]} />
      </section>
    );
  }

  return <HeroCarousel slides={slides} />;
}

// Os elementos clicáveis sobre a imagem (a imagem em si já vem pronta de
// fora, sem texto do site) — cada um na posição livre (x/y em %) que o
// admin escolheu no editor. Sem nenhum botão cadastrado, não aparece nada.
function HeroButtons({ slide }: { slide: HeroSlide }) {
  return (
    <>
      {slide.buttons?.map((b) => (
        <Link
          key={b.id}
          href={b.link?.trim() || "#produtos"}
          style={{
            color: b.text_color || "#0f3a68",
            backgroundColor: b.bg_color || "#ffc83d",
            left: `${b.x}%`,
            top: `${b.y}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-5 py-2.5 text-sm font-extrabold shadow-lg transition-transform hover:scale-105 sm:px-7 sm:py-3.5"
        >
          {b.text}
        </Link>
      ))}
    </>
  );
}

// Carrossel "infinito": clona o último slide no início e o primeiro no
// fim, desliza pra ele normalmente e, quando a animação termina, teleporta
// sem transição de volta pro slide real equivalente — por isso clicar pra
// direita nunca parece voltar pra esquerda.
function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const n = slides.length;
  const extended = [slides[n - 1], ...slides, slides[0]];
  const [position, setPosition] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  // Trava clique/arraste novo enquanto a animação de 700ms ainda roda. Sem
  // isso, clicar rápido demais empurrava `position` além do clone extra nas
  // pontas (array `extended` não tem slide ali) antes do teleporte do
  // `handleTransitionEnd` rodar — a home mostrava um slide em branco preso.
  const isAnimating = useRef(false);
  // Progresso (0 a 1) da contagem de 10s até o próximo slide automático.
  // Controlado por requestAnimationFrame em vez de CSS puro pra conseguir
  // pausar/retomar sem perder o tempo já decorrido.
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const frameStartRef = useRef(0);
  const elapsedRef = useRef(0);
  const lastUpdateRef = useRef(0);

  const activeIndex = (((position - 1) % n) + n) % n;
  const prevActiveIndexRef = useRef(activeIndex);

  const goNext = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setWithTransition(true);
    setPosition((p) => p + 1);
  };
  const goPrev = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setWithTransition(true);
    setPosition((p) => p - 1);
  };
  const goTo = (i: number) => {
    if (isAnimating.current || i === activeIndex) return;
    isAnimating.current = true;
    setWithTransition(true);
    setPosition(i + 1);
  };

  const handleTransitionEnd = () => {
    if (position === 0) {
      setWithTransition(false);
      setPosition(n);
    } else if (position === n + 1) {
      setWithTransition(false);
      setPosition(1);
    }
    isAnimating.current = false;
  };

  const AUTOPLAY_MS = 10000;

  // Passa pro próximo sozinho depois de 10s de progresso acumulado. Só um
  // efeito (não dois) de propósito: precisa saber, no mesmo lugar, se essa
  // execução é "mudou de slide" (zera a contagem) ou só "pausou/retomou"
  // (mantém o que já tinha decorrido) — separar isso em dois efeitos criava
  // uma corrida entre o reset e o acúmulo do tempo decorrido.
  useEffect(() => {
    if (prevActiveIndexRef.current !== activeIndex) {
      prevActiveIndexRef.current = activeIndex;
      elapsedRef.current = 0;
      setProgress(0);
    }
    if (isPaused) return;

    frameStartRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = elapsedRef.current + (now - frameStartRef.current);
      const pct = Math.min(elapsed / AUTOPLAY_MS, 1);
      if (now - lastUpdateRef.current > 50 || pct >= 1) {
        lastUpdateRef.current = now;
        setProgress(pct);
      }
      if (pct >= 1 && !isAnimating.current) {
        goNext();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      elapsedRef.current += performance.now() - frameStartRef.current;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isPaused]);

  return (
    <section className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 sm:aspect-[16/9] md:aspect-[21/9]">
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full w-full ${
          withTransition ? "transition-transform duration-700 ease-out" : ""
        }`}
        style={{ transform: `translateX(-${position * 100}%)` }}
      >
        {extended.map((slide, i) => (
          <div key={`${slide.id}-${i}`} className="relative h-full w-full shrink-0">
            <Image
              src={slide.image_url}
              alt="Plavii"
              fill
              priority={i === 1}
              className="object-cover"
              sizes="100vw"
            />
            <HeroButtons slide={slide} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={goPrev}
        aria-label="Hero anterior"
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-lg transition-colors hover:bg-white"
      >
        <LineIcon name="chevron-left" className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Próximo Hero"
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-lg transition-colors hover:bg-white"
      >
        <LineIcon name="chevron-right" className="h-5 w-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2.5">
        <button
          type="button"
          onClick={() => setIsPaused((p) => !p)}
          aria-label={isPaused ? "Retomar troca automática" : "Pausar troca automática"}
          className="flex h-5 w-5 items-center justify-center text-white/85 transition-colors hover:text-white"
        >
          <LineIcon name={isPaused ? "play" : "pause"} className="h-3 w-3" filled={isPaused} />
        </button>
        <div className="flex items-center gap-1.5">
          {slides.map((s, i) =>
            i === activeIndex ? (
              <div
                key={s.id}
                className="relative h-2 w-8 overflow-hidden rounded-full bg-white/40"
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-white"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            ) : (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir pro Hero ${i + 1}`}
                className="h-2 w-2 rounded-full bg-white/50 transition-colors hover:bg-white/80"
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

const ROTACOES = ["-rotate-6", "rotate-3", "-rotate-2"];

// Hero padrão de sempre, usado enquanto não tem nenhum slide cadastrado.
function DefaultHero({ destaques }: { destaques: Product[] }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-light/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="flex flex-col gap-5">
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-dark">
            <LineIcon name="bolt" className="h-3.5 w-3.5" />
            Ofertas da semana
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Achou, gostou, <span className="text-accent">chegou.</span>
          </h1>
          <p className="max-w-md text-lg text-white/85">
            Eletrônicos, acessórios e utilidades com frete grátis e até 1 ano
            de garantia. Loja física em Sobradinho — atendimento de gente pra
            gente.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#produtos"
              className="rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold text-brand-dark shadow-lg transition-transform hover:scale-105"
            >
              Ver ofertas
            </a>
          </div>
        </div>

        <div className="relative mx-auto hidden h-[470px] w-full max-w-md md:block">
          {destaques.map((p, i) => (
            <Link
              key={p.id}
              href={`/produto/${p.slug}`}
              className={`absolute w-44 overflow-hidden rounded-2xl bg-white text-neutral-800 shadow-2xl transition-transform duration-300 hover:z-10 hover:scale-110 hover:rotate-0 ${ROTACOES[i]} ${
                i === 0 ? "left-0 top-10" : i === 1 ? "right-0 top-0" : "bottom-0 left-[38%]"
              }`}
            >
              <div className="relative aspect-square bg-neutral-50 p-2">
                <Image src={p.image} alt={p.name} fill className="object-contain p-2" sizes="180px" />
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-xs text-neutral-500">{p.name}</p>
                <p className="font-extrabold text-brand">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
