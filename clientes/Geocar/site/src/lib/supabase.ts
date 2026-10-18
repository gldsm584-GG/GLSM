import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Sem as variáveis o site roda em modo demonstração: a vitrine usa o estoque
// inicial (src/lib/estoque-inicial.ts) e o painel fica travado.
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || "http://localhost:54321",
  supabaseAnonKey || "demo"
);
