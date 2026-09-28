"use client";

import LineIcon from "@/components/LineIcon";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";

// Botão flutuante que só o admin vê, em qualquer página da loja (fora do
// painel /admin), pra editar aquele conteúdo ali mesmo.
export default function AdminEditButton({
  label,
  onClick,
  editing = false,
  offset = 0,
}: {
  label: string;
  onClick: () => void;
  editing?: boolean;
  // Empilha vários desses botões na mesma tela (ex: home com Hero e
  // Ofertas): cada offset extra em px sobe um pra não tampar o outro.
  offset?: number;
}) {
  const { user } = useAuth();
  if (!isAdmin(user)) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ bottom: `${20 + offset}px` }}
      className={`fixed right-5 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl transition-colors ${
        editing ? "bg-neutral-800 hover:bg-neutral-700" : "bg-brand hover:bg-brand-dark"
      }`}
    >
      <LineIcon name={editing ? "close" : "pencil"} className="h-4 w-4" />
      {editing ? "Fechar edição" : label}
    </button>
  );
}
