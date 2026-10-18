import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-6xl font-extrabold italic text-brand">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-ink">Página não encontrada</h1>
      <p className="mt-2 text-neutral-500">
        Esse carro pode já ter sido vendido ou o link mudou.
      </p>
      <Link
        href="/#estoque"
        className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
      >
        Ver o estoque
      </Link>
    </div>
  );
}
