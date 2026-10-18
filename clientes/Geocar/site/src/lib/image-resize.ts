// Foto de celular costuma ter 3–8 MB. Antes de subir pro Supabase, reduz pra
// no máximo 1600px no lado maior em JPEG — fica leve e continua nítida.
const MAX_SIDE = 1600;
const QUALITY = 0.85;

export async function resizeForUpload(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao converter a foto"))),
      "image/jpeg",
      QUALITY
    )
  );
}
