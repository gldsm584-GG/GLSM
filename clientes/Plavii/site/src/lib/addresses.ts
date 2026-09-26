import { onlyDigits } from "./profile";
import { supabase } from "./supabase";

export type Address = {
  id: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

type Meta = Record<string, unknown> | undefined;

// Lista de endereços da conta (user_metadata.enderecos). Contas criadas no
// cadastro completo, mas sem lista ainda, usam o endereço do cadastro.
export function getAddresses(meta: Meta): Address[] {
  if (!meta) return [];
  if (Array.isArray(meta.enderecos)) return meta.enderecos as Address[];
  if (typeof meta.rua === "string" && meta.rua) {
    return [
      {
        id: "cadastro",
        cep: String(meta.cep ?? ""),
        rua: meta.rua,
        numero: String(meta.numero ?? ""),
        complemento: String(meta.complemento ?? ""),
        bairro: String(meta.bairro ?? ""),
        cidade: String(meta.cidade ?? ""),
        uf: String(meta.uf ?? ""),
      },
    ];
  }
  return [];
}

export async function saveAddresses(list: Address[]): Promise<string | null> {
  const { error } = await supabase.auth.updateUser({ data: { enderecos: list } });
  return error?.message ?? null;
}

// "Trecho SIA Trecho 5 109, Laboratório Capital - CEP 71205050"
export function addressLine(a: Address): string {
  return `${a.rua} ${a.numero}, ${a.bairro} - CEP ${onlyDigits(a.cep)}`;
}

export function addressSecondLine(a: Address): string {
  const local = [a.cidade, a.uf].filter(Boolean).join("/");
  return [a.complemento, local].filter(Boolean).join(" · ");
}

// Formato gravado no pedido (mesmo de antes: textos simples)
export function orderAddressFields(a: Address) {
  return {
    address: [
      [a.rua, a.numero].filter(Boolean).join(", "),
      a.complemento,
      a.bairro,
    ]
      .filter(Boolean)
      .join(" - "),
    city: a.uf ? `${a.cidade}/${a.uf}` : a.cidade,
    cep: a.cep,
  };
}

// "Sh Mansões Sobradinho Qms 3 2" (rua + número + complemento)
export function addressPickerLine1(a: Address): string {
  return [`${a.rua} ${a.numero}`.trim(), a.complemento].filter(Boolean).join(", ");
}

// "CEP: 73080800 - Brasília, DF"
export function addressPickerLine2(a: Address): string {
  const local = [a.cidade, a.uf].filter(Boolean).join(", ");
  return `CEP: ${onlyDigits(a.cep)} - ${local}`;
}

// Texto do botão de localização no topo: "Brasília 71205050"
export function addressHeaderLabel(a: Address): string {
  return `${a.cidade} ${onlyDigits(a.cep)}`;
}
