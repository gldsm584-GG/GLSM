// Gera supabase/seed.sql a partir de src/lib/estoque-inicial.ts.
// Uso (de dentro de site/): node supabase/gerar-seed.mjs > supabase/seed.sql
import { ESTOQUE_INICIAL } from "../src/lib/estoque-inicial.ts";

const str = (v) => (v === null || v === undefined || v === "" ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const num = (v) => (v === null || v === undefined ? "null" : String(v));
const arr = (list) => `array[${list.map(str).join(", ")}]::text[]`;

const rows = ESTOQUE_INICIAL.map((v) =>
  [
    `  (${str(v.slug)}, ${str(v.tipo)}, ${str(v.marca)}, ${str(v.modelo)}, ${str(v.versao)},`,
    `   ${num(v.anoFabricacao)}, ${num(v.anoModelo)}, ${num(v.km)}, ${str(v.cambio)}, ${str(v.combustivel)},`,
    `   ${str(v.cor)}, ${str(v.motor)}, ${num(v.preco)}, ${str(v.status)}, ${v.destaque},`,
    `   ${arr(v.opcionais)},`,
    `   ${str(v.descricao)},`,
    `   ${arr(v.fotos)},`,
    `   '${v.postadoEm}T12:00:00Z')`,
  ].join("\n")
);

console.log(`-- ============================================================
-- Geocar — estoque inicial (gerado por supabase/gerar-seed.mjs a partir de
-- src/lib/estoque-inicial.ts). Rode depois do schema.sql. As fotos ficam no
-- próprio site (public/carros/); as novas, enviadas pelo painel, vão pro
-- Storage do Supabase. Pode rodar de novo: carro com o mesmo slug é ignorado.
-- ============================================================

insert into veiculos (slug, tipo, marca, modelo, versao, ano_fabricacao, ano_modelo, km, cambio,
  combustivel, cor, motor, preco, status, destaque, opcionais, descricao, fotos, created_at) values
${rows.join(",\n")}
on conflict (slug) do nothing;`);
