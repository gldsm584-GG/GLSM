import Image from "next/image";
import type { ReactNode } from "react";

// Formatação leve e segura: **negrito**, *itálico* e ![alt](url) pra imagem
// em bloco. Sem HTML — nunca usa dangerouslySetInnerHTML.
function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key++}>{match[2]}</em>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function RichText({ content }: { content: string }) {
  const blocks = content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => {
        const imageMatch = block.match(/^!\[([^\]]*)\]\((\S+)\)$/);
        if (imageMatch) {
          return (
            <div
              key={i}
              className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100"
            >
              <Image
                src={imageMatch[2]}
                alt={imageMatch[1]}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          );
        }

        const lines = block.split("\n");
        return (
          <p key={i} className="leading-relaxed text-neutral-700">
            {lines.map((line, li) => (
              <span key={li}>
                {parseInline(line)}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
