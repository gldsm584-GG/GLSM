"use client";

import { useRef, useState } from "react";
import DropZone from "@/components/DropZone";
import LineIcon from "@/components/LineIcon";
import { updateSitePage, uploadSiteImage, type SitePage } from "@/lib/site-content";

// Envolve o texto selecionado no textarea com um marcador (**negrito**,
// *itálico*), ou insere o marcador vazio no cursor se nada tá selecionado.
function wrapSelection(
  textarea: HTMLTextAreaElement,
  marker: string,
  value: string,
  setValue: (v: string) => void
) {
  const { selectionStart, selectionEnd } = textarea;
  const selected = value.slice(selectionStart, selectionEnd);
  const next =
    value.slice(0, selectionStart) + marker + selected + marker + value.slice(selectionEnd);
  setValue(next);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(selectionStart + marker.length, selectionEnd + marker.length);
  });
}

export default function PageEditor({
  page,
  onDone,
  onCancel,
}: {
  page: SitePage;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = (marker: string) => {
    if (!textareaRef.current) return;
    wrapSelection(textareaRef.current, marker, content, setContent);
  };

  const handleInsertImage = async (file: File) => {
    setUploadingImage(true);
    setError(null);
    try {
      const url = await uploadSiteImage(file);
      setContent((c) => `${c.trim()}\n\n![](${url})\n\n`.trim());
    } catch {
      setError("Não deu pra enviar a imagem. Tenta de novo.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateSitePage(page.slug, { title, content });
      onDone();
    } catch (err) {
      setError(
        err instanceof Error && err.message === "NO_PERMISSION"
          ? "Sua conta não tem permissão de admin no Supabase pra editar."
          : "Não deu pra salvar. Tenta de novo."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 md:items-center md:p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col gap-4 overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl md:rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-800">Editar página</h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Fechar"
            className="text-neutral-400 hover:text-neutral-600"
          >
            <LineIcon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-700">Conteúdo</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleFormat("**")}
                title="Negrito"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => handleFormat("*")}
                title="Itálico"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-sm italic text-neutral-600 hover:bg-neutral-50"
              >
                I
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreve o texto da página aqui. Selecione um trecho e clica em B ou I pra formatar."
            className="rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-brand"
          />
        </div>

        <DropZone
          onFile={handleInsertImage}
          uploading={uploadingImage}
          hint="Arraste uma imagem aqui pra adicionar no texto"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-5 py-2 text-sm font-semibold text-neutral-500 hover:bg-neutral-100"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
