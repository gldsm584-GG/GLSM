import type { User } from "@supabase/supabase-js";

const ADMIN_EMAILS = ["gustest@gmail.com"];

export function isAdmin(user: User | null): boolean {
  return !!user?.email && ADMIN_EMAILS.includes(user.email);
}
