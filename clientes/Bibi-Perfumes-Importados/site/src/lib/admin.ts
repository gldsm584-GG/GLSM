import type { User } from "@supabase/supabase-js";

// TODO: confirmar com o Gustavo se é esse email mesmo ou se prefere um
// email dedicado pra administrar a loja (como fez com a Plavii).
const ADMIN_EMAILS = ["gldsm584@gmail.com"];

export function isAdmin(user: User | null): boolean {
  return !!user?.email && ADMIN_EMAILS.includes(user.email);
}
