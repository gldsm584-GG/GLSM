// Frete: retirada na loja (grátis) + cotação pelo Melhor Envio (Correios,
// Jadlog etc.). Só roda no servidor — o token do Melhor Envio nunca vai pro
// navegador. Variáveis de ambiente (Vercel):
//   MELHORENVIO_TOKEN          token da conta no Melhor Envio (obrigatória)
//   MELHORENVIO_ORIGIN_CEP     CEP da loja, de onde o frete sai (obrigatória)
//   MELHORENVIO_CONTACT_EMAIL  email de contato técnico (vai no User-Agent)
//   MELHORENVIO_API_URL        opcional; troque por https://sandbox.melhorenvio.com.br pra testar
//   SHIPPING_DEFAULT_WEIGHT_KG / _WIDTH_CM / _HEIGHT_CM / _LENGTH_CM  caixa padrão por item (opcionais)
// Sem token ou sem CEP de origem, o site só oferece a retirada na loja.

export const PICKUP_ADDRESS = "Retirada na loja";

export type ShippingOption = {
  id: string; // "me-<id do serviço no Melhor Envio>"
  name: string; // ex.: "SEDEX", ".Package"
  company: string; // ex.: "Correios", "Jadlog"
  price: number;
  days: number | null; // prazo em dias úteis, quando o serviço informa
};

type QuoteItem = { quantity: number; price: number };

function numberFromEnv(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function shippingConfigured(): boolean {
  return Boolean(
    process.env.MELHORENVIO_TOKEN && onlyDigits(process.env.MELHORENVIO_ORIGIN_CEP ?? "").length === 8
  );
}

type MelhorEnvioService = {
  id: number;
  name: string;
  price?: string | number;
  custom_price?: string | number;
  delivery_time?: number;
  custom_delivery_time?: number;
  error?: string;
  company?: { name?: string };
};

export async function quoteShipping(toCep: string, items: QuoteItem[]): Promise<ShippingOption[]> {
  const destination = onlyDigits(toCep);
  if (!shippingConfigured() || destination.length !== 8 || items.length === 0) return [];

  const baseUrl = (process.env.MELHORENVIO_API_URL || "https://melhorenvio.com.br").replace(/\/$/, "");
  const contact = process.env.MELHORENVIO_CONTACT_EMAIL || "contato-nao-configurado";

  const response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MELHORENVIO_TOKEN}`,
      "User-Agent": `Plavii (${contact})`,
    },
    body: JSON.stringify({
      from: { postal_code: onlyDigits(process.env.MELHORENVIO_ORIGIN_CEP!) },
      to: { postal_code: destination },
      // Cada linha do carrinho vira um volume com a caixa padrão (os produtos
      // ainda não têm peso/medidas cadastrados).
      products: items.map((item, index) => ({
        id: String(index + 1),
        width: numberFromEnv("SHIPPING_DEFAULT_WIDTH_CM", 20),
        height: numberFromEnv("SHIPPING_DEFAULT_HEIGHT_CM", 15),
        length: numberFromEnv("SHIPPING_DEFAULT_LENGTH_CM", 20),
        weight: numberFromEnv("SHIPPING_DEFAULT_WEIGHT_KG", 0.5),
        insurance_value: Math.round(item.price * 100) / 100,
        quantity: item.quantity,
      })),
      options: { receipt: false, own_hand: false },
    }),
    cache: "no-store",
  });

  // O motivo da falha (status e começo da resposta, sem o token) vai pro log
  // da Vercel — é a única forma de saber por que o frete não apareceu.
  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 400);
    throw new Error(`Melhor Envio respondeu ${response.status}: ${detail}`);
  }

  const services = (await response.json()) as MelhorEnvioService[];
  if (!Array.isArray(services)) {
    throw new Error(`Melhor Envio devolveu um formato inesperado: ${JSON.stringify(services).slice(0, 400)}`);
  }

  return services
    .filter((service) => !service.error)
    .map((service): ShippingOption | null => {
      const price = Number(service.custom_price ?? service.price);
      if (!Number.isFinite(price) || price < 0) return null;
      const days = service.custom_delivery_time ?? service.delivery_time;
      return {
        id: `me-${service.id}`,
        name: service.name,
        company: service.company?.name ?? "",
        price: Math.round(price * 100) / 100,
        days: typeof days === "number" ? days : null,
      };
    })
    .filter((option): option is ShippingOption => option !== null)
    .sort((a, b) => a.price - b.price);
}
