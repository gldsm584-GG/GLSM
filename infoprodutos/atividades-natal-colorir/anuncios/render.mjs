// Gera os criativos a partir de anuncios.html: um PNG por .slide, com o nome do data-nome, em ../facebook/fotos/.
// Altura padrão 1350 (feed); slide com data-h="1920" sai no tamanho de stories/reels.
// Uso: node render.mjs   (dentro desta pasta)
import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { foto } from "../comum.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const HTML = pathToFileURL(join(AQUI, "anuncios.html")).href;
const SAIDA = join(AQUI, "..", "facebook", "fotos");
mkdirSync(SAIDA, { recursive: true });

for (const [, id, atributos] of readFileSync(join(AQUI, "anuncios.html"), "utf8").matchAll(/<section class="slide[^"]*" id="(s\d+)"([^>]*)>/g)) {
  const h = atributos.match(/data-h="(\d+)"/)?.[1] || "1350";
  const png = join(SAIDA, atributos.match(/data-nome="([^"]+)"/)[1] + ".png");
  foto(`${HTML}#${id}`, png, 1080, h);
  console.log("PNG:", png);
}
