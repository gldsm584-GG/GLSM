import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

  const emails: Record<string, string> = {};
  for (const user of data.users) {
    if (user.email) emails[user.id] = user.email;
  }

  return NextResponse.json({ emails });
}
