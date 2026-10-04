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
    return <HeroSingle slide={slides[0]} />;
  }

  return <HeroCarousel slides={slides} />;
}

// No celular a altura do Hero acompanha a proporção da imagem, mas nunca
// mais larga que 3:2 — imagens bem largas (banner) ficam com a moldura
// mais alta e perdem só uma faixa pequena das laterais (object-cover);
// imagens quadradas/verticais aparecem inteiras. De `sm` pra cima segue a
// moldura larga fixa de sempre. A proporção real só é conhecida depois que
// a imagem carrega, por isso começa em 4/3.
const DEFAULT_RATIO = 4 / 3;
const MAX_MOBILE_RATIO = 3 / 2;
const mobileRatio = (ratio: number | undefined) =>
  Math.min(ratio ?? DEFAULT_RATIO, MAX_MOBILE_RATIO);
const FRAME_CLASS =
  "relative w-full aspect-(--hero-ratio) overflow-hidden bg-neutral-100 sm:aspect-[16/9] md:aspect-[21/9]";
const IMAGE_CLASS = "object-cover";

function useImageRatios() {
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const onLoad = (id: string) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    const ratio = naturalWidth / naturalHeight;
    setRatios((prev) => (prev[id] === ratio ? prev : { ...prev, [id]: ratio }));
  };
  return { ratios, onLoad };
}

function HeroSingle({ slide }: { slide: HeroSlide }) {
  const { ratios, onLoad } = useImageRatios();
  return (
    <section
      className={FRAME_CLASS}
      style={{ "--hero-ratio": mobileRatio(ratios[slide.id]) } as React.CSSProperties}
    >
      <Image
        src={slide.image_url}
        alt="Plavii"
        fill
        priority
        onLoad={onLoad(slide.id)}
        className={IMAGE_CLASS}
        sizes="100vw"
      />
      <HeroButtons slide={slide} />
    </section>
  );
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
  // Arraste (mouse ou dedo): `dragOffset` é quantos px o slide já seguiu o
  // ponteiro; só começa de verdade depois de 5px de movimento, pra um clique
  // parado num botão do Hero continuar sendo clique.
  const { ratios, onLoad } = useImageRatios();
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ startX: 0, startTime: 0, active: false, moved: false, width: 0 });
  const suppressClick = useRef(false);
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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = {
      startX: e.clientX,
      startTime: performance.now(),
      active: true,
      moved: false,
      width: e.currentTarget.offsetWidth,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.moved) {
      if (Math.abs(dx) < 5) return;
      // O autoplay pode ter começado uma troca entre o toque e o movimento.
      if (isAnimating.current) {
        d.active = false;
        return;
      }
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      setWithTransition(false);
    }
    setDragOffset(Math.max(-d.width, Math.min(d.width, dx)));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) return;
    suppressClick.current = true;
    setTimeout(() => {
      suppressClick.current = false;
    }, 0);
    const dx = e.clientX - d.startX;
    const velocity = Math.abs(dx) / Math.max(performance.now() - d.startTime, 1);
    const commit =
      !cancelled && (Math.abs(dx) > d.width * 0.15 || (Math.abs(dx) > 30 && velocity > 0.4));
    setIsDragging(false);
    setWithTransition(true);
    if (commit) {
      if (dx < 0) goNext();
      else goPrev();
    }
    setDragOffset(0);
  };

  const AUTOPLAY_MS = 10000;
  const paused = isPaused || isDragging;

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
    if (paused) return;

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
  }, [activeIndex, paused]);

  return (
    <section
      className={FRAME_CLASS}
      style={{ "--hero-ratio": mobileRatio(ratios[slides[activeIndex].id]) } as React.CSSProperties}
    >
      <div
        onTransitionEnd={handleTransitionEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => endDrag(e, false)}
        onPointerCancel={(e) => endDrag(e, true)}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`flex h-full w-full touch-pan-y select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        } ${withTransition ? "transition-transform duration-700 ease-out" : ""}`}
        style={{ transform: `translateX(calc(-${position * 100}% + ${dragOffset}px))` }}
      >
        {extended.map((slide, i) => (
          <div key={`${slide.id}-${i}`} className="relative h-full w-full shrink-0">
            <Image
              src={slide.image_url}
              alt="Plavii"
              fill
              priority={i === 1}
              draggable={false}
              onLoad={onLoad(slide.id)}
              className={IMAGE_CLASS}
              sizes="100vw"
            />
            <HeroButtons slide={slide} />
          </div>
        ))}
      </div>

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
            Eletrônicos, acessórios e utilidades com até 1 ano de garantia.
            Loja física em Sobradinho — atendimento de gente pra gente.
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
