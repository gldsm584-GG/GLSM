"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import LineIcon from "@/components/LineIcon";

// Área de soltar (ou clicar pra escolher) uma imagem. Valida tipo e tamanho
// antes de chamar onFile.
export default function DropZone({
  onFile,
  uploading = false,
  hint = "Arraste uma imagem aqui ou clique pra escolher",
  className = "",
}: {
  onFile: (file: File) => void;
  uploading?: boolean;
  hint?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Escolhe um arquivo de imagem (JPG, PNG ou WebP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("A imagem tem mais de 8 MB. Escolhe uma menor.");
      return;
    }
    setError(null);
    onFile(file);
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        disabled={uploading}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          over ? "border-brand bg-brand/5" : "border-neutral-300 hover:border-brand/60"
        }`}
      >
        <LineIcon name="package" className="h-6 w-6 text-neutral-400" />
        <p className="text-sm text-neutral-500">
          {uploading ? "Enviando imagem..." : hint}
        </p>
        <p className="text-xs text-neutral-400">JPG, PNG ou WebP, até 8 MB.</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0])}
        className="hidden"
      />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
