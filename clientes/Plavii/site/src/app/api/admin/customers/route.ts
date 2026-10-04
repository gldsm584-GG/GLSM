import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type AdminUser = {
  id: string;
  email: string;
  nome: string;
  sobrenome: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  createdAt: string;
};

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: caller } = await supabaseAdmin.auth.getUser(token);
  if (!isAdmin(caller.user)) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
  if (error) {
    return NextResponse.json({ error: "Falha ao listar usuários" }, { status: 500 });
  }

  // Sem a conta de admin na lista de clientes
  const users: AdminUser[] = data.users
    .filter((u) => !isAdmin(u))
    .map((u) => {
      const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
      const str = (key: string) => (typeof meta[key] === "string" ? (meta[key] as string) : "");
      return {
        id: u.id,
        email: u.email ?? "",
        nome: str("nome"),
        sobrenome: str("sobrenome"),
        telefone: str("telefone"),
        cep: str("cep"),
        rua: str("rua"),
        numero: str("numero"),
        bairro: str("bairro"),
        cidade: str("cidade"),
        createdAt: u.created_at,
      };
    });

  return NextResponse.json({ users });
}
