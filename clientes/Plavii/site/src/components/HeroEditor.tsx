"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DropZone from "@/components/DropZone";
import HeroSlideEditor from "@/components/HeroSlideEditor";
import LineIcon from "@/components/LineIcon";
import { addHeroSlide, deleteHeroSlide, type HeroSlide } from "@/lib/hero";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";
import { uploadSiteImage } from "@/lib/site-content";

// Deixa o admin gerenciar o carrossel de Heroes da home direto no site:
// solta uma imagem pra adicionar (feita no Canva, por exemplo), apaga as
// que não quer mais e edita o conteúdo (título, botão, produtos soltos em
// cima da imagem) de cada uma. Sem nenhum slide, a home volta pro padrão.
// Aberto/fechado pelo menu único do admin (AdminMenu), não tem gatilho próprio.
export default function HeroEditor({
  slides,
  open,
  onClose,
}: {
  slides: HeroSlide[];
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isAdmin(user) || !open) return null;

  const handleClose = () => {
    setEditingSlide(null);
    onClose();
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadSiteImage(file);
      await addHeroSlide(url);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error && err.message === "NO_PERMISSION"
          ? "Sua conta não tem permissão de admin no Supabase pra editar."
          : "Não deu pra adicionar essa imagem. Tenta de novo."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    setError(null);
    try {
      await deleteHeroSlide(id);
      router.refresh();
    } catch {
      setError("Não deu pra apagar. Tenta de novo.");
    } finally {
      setRemovingId(null);
    }
  };

  if (editingSlide) {
    return (
      <HeroSlideEditor
        slide={editingSlide}
        onDone={() => {
          setEditingSlide(null);
          router.refresh();
        }}
        onCancel={() => setEditingSlide(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 md:items-center md:p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl md:rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-800">Heroes da home</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar"
            className="text-neutral-400 hover:text-neutral-600"
          >
            <LineIcon name="close" className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-neutral-500">
          Cada imagem vira um slide do carrossel, com setinha pra
          navegar. Sem nenhuma imagem aqui, a home volta pro Hero padrão.
        </p>

        {slides.length > 0 && (
          <ul className="flex flex-col gap-2">
            {slides.map((slide, i) => (
              <li
                key={slide.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 p-2"
              >
                <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  <Image src={slide.image_url} alt="" fill className="object-cover" sizes="96px" />
                </div>
                <span className="flex-1 truncate text-sm text-neutral-600">
                  Hero {i + 1}
                  {slide.buttons?.length
                    ? ` — ${slide.buttons.length} botão${slide.buttons.length > 1 ? "ões" : ""}`
                    : ""}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingSlide(slide)}
                  title="Editar conteúdo"
                  aria-label="Editar conteúdo desse Hero"
                  className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-brand/10 hover:text-brand"
                >
                  <LineIcon name="pencil" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(slide.id)}
                  disabled={removingId === slide.id}
                  title="Apagar"
                  aria-label="Apagar esse Hero"
                  className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                >
                  <LineIcon name="trash" className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <DropZone
          onFile={handleFile}
          uploading={uploading}
          hint="Arraste uma imagem aqui pra adicionar outro Hero"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
