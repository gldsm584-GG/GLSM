// Dados do cadastro do cliente. Ficam salvos na própria conta do Supabase
// (user_metadata) — não precisa de tabela nova no banco.
export type Profile = {
  nome: string;
  sobrenome: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export const emptyProfile: Profile = {
  nome: "",
  sobrenome: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

type Meta = Record<string, unknown> | undefined;

export function profileFromMeta(meta: Meta): Profile {
  const read = (key: keyof Profile) =>
    typeof meta?.[key] === "string" ? (meta[key] as string) : "";
  return {
    nome: read("nome"),
    sobrenome: read("sobrenome"),
    cep: read("cep"),
    rua: read("rua"),
    numero: read("numero"),
    complemento: read("complemento"),
    bairro: read("bairro"),
    cidade: read("cidade"),
    uf: read("uf"),
  };
}

export function fullName(p: Pick<Profile, "nome" | "sobrenome">): string {
  return `${p.nome} ${p.sobrenome}`.replace(/\s+/g, " ").trim();
}

// "Rua X, 12 - Apto 3 - Bairro, Cidade/UF - CEP 73082-260"
export function addressText(p: Profile): string {
  if (!p.rua) return "";
  const street = [p.rua, p.numero].filter(Boolean).join(", ");
  const local = p.uf ? `${p.cidade}/${p.uf}` : p.cidade;
  return [
    [street, p.complemento, p.bairro].filter(Boolean).join(" - "),
    local,
    p.cep && `CEP ${p.cep}`,
  ]
    .filter(Boolean)
    .join(", ");
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

// 73082-260
export function formatCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export type CepResult = {
  rua: string;
  bairro: string;
  cidade: string;
  uf: string;
};

// Consulta pública do ViaCEP (só o CEP é enviado). Retorna null se não achar.
export async function lookupCep(cep: string): Promise<CepResult | null> {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return {
      rua: data.logradouro ?? "",
      bairro: data.bairro ?? "",
      cidade: data.localidade ?? "",
      uf: data.uf ?? "",
    };
  } catch {
    return null;
  }
}
