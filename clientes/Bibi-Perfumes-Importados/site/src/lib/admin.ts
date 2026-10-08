import type { User } from "@supabase/supabase-js";

// Email do admin da loja (2026-10-07). Precisa bater com a função
// is_admin() do Supabase (supabase/002_admin_bibiperfumes.sql) — é ela que
// libera de verdade salvar produtos, pedidos e fotos.
const ADMIN_EMAILS = ["bibiperfumes@gmail.com"];

export function isAdmin(user: User | null): boolean {
  return !!user?.email && ADMIN_EMAILS.includes(user.email);
}
