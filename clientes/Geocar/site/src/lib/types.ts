export type VehicleType = "carro" | "moto";
export type VehicleStatus = "disponivel" | "reservado" | "vendido";

export type Vehicle = {
  id: string;
  slug: string;
  tipo: VehicleType;
  marca: string;
  modelo: string;
  versao: string;
  anoFabricacao: number | null;
  anoModelo: number;
  km: number | null;
  cambio: string;
  combustivel: string;
  cor: string;
  motor: string;
  // Sem preço = "Consulte" (a Geocar não divulga preço no Instagram)
  preco: number | null;
  status: VehicleStatus;
  destaque: boolean;
  opcionais: string[];
  descricao: string;
  fotos: string[];
  createdAt: string;
};

// O que o formulário do painel edita (id e data vêm do banco)
export type VehicleInput = Omit<Vehicle, "id" | "createdAt">;

export const ETAPAS = ["novo", "negociando", "visita", "vendido", "perdido"] as const;
export type Etapa = (typeof ETAPAS)[number];

export const ORIGENS = ["Instagram", "WhatsApp", "Loja", "Indicação", "Site", "Outro"] as const;

export type Lead = {
  id: string;
  nome: string;
  telefone: string;
  veiculoId: string | null;
  veiculoNome: string | null;
  origem: string;
  etapa: Etapa;
  observacao: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadInput = {
  nome: string;
  telefone: string;
  veiculoId: string | null;
  origem: string;
  etapa: Etapa;
  observacao: string;
};
