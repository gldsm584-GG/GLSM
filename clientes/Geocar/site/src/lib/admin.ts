import type { User } from "@supabase/supabase-js";

// Quem entra no painel. Precisa bater com a função is_admin() do Supabase
// (supabase/schema.sql) — é ela que libera de verdade salvar carros,
// negociações e fotos. Por enquanto é o Gustavo; quando a Geocar fechar,
// trocar pelos emails do George e do Diógenes nos dois lugares.
const ADMIN_EMAILS = ["gldsm584@gmail.com"];

export function isAdmin(user: User | null): boolean {
  return !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
}
