import Link from "next/link";
import { notFound } from "next/navigation";
import PageInlineEditor from "@/components/PageInlineEditor";
import RichText from "@/components/RichText";
import { getSitePage } from "@/lib/site-content";

// As duas páginas em branco do rodapé — o admin preenche o conteúdo
// direto aqui na loja, sem precisar ir no painel.
const KNOWN_SLUGS = ["pagina-1", "pagina-2"];

export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!KNOWN_SLUGS.includes(slug)) notFound();

  const page = await getSitePage(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand">
          Início
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-700">{page.title || "Página"}</span>
      </nav>

      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-800 md:text-3xl">
        {page.title || "Página em branco"}
      </h1>

      <div className="mt-6">
        {page.content ? (
          <RichText content={page.content} />
        ) : (
          <p className="text-neutral-400">Essa página ainda não tem conteúdo.</p>
        )}
      </div>

      <PageInlineEditor page={page} />
    </div>
  );
}
