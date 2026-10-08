import type { User } from "@supabase/supabase-js";
import { isAdmin } from "./admin";

// Pra onde mandar depois de entrar/cadastrar: o "?volta=" da URL (ex.: veio
// do carrinho), senão o painel (admin) ou a loja (cliente). Só aceita
// caminho interno, pra ninguém usar o link pra mandar o cliente pra outro site.
export function afterLoginPath(user: User | null): string {
  const volta = new URLSearchParams(window.location.search).get("volta");
  if (volta && volta.startsWith("/") && !volta.startsWith("//")) return volta;
  return isAdmin(user) ? "/admin" : "/";
}
