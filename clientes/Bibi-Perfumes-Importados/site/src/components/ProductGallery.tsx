"use client";

import Image from "next/image";
import { useRef, useState, type MouseEvent } from "react";

export default function ProductGallery({
  images,
  alt,
  discountLabel,
}: {
  images: string[];
  alt: string;
  discountLabel?: string | null;
}) {
  const gallery = images.length > 0 ? images : ["/sem-imagem.svg"];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const frameRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-4">
      {gallery.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 md:order-1 md:w-20 md:flex-col md:overflow-y-auto md:pb-0">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-neutral-50 transition ${
                i === active
                  ? "border-brand ring-1 ring-brand"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <Image src={src} alt="" fill className="object-contain" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      <div
        ref={frameRef}
        className="relative order-1 mx-auto aspect-square w-full max-w-sm cursor-zoom-in overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 md:order-2 md:max-w-none md:flex-1"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => {
          setZoomed(false);
          setZoomOrigin("50% 50%");
        }}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={gallery[active]}
          alt={alt}
          fill
          className="object-contain transition-transform duration-200 ease-out"
          style={{
            transformOrigin: zoomOrigin,
            transform: zoomed ? "scale(2)" : "scale(1)",
          }}
          sizes="(max-width: 768px) 90vw, 416px"
          priority
        />
        {discountLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white">
            {discountLabel}
          </span>
        )}
      </div>
    </div>
  );
}
