// Imagens da página do Facebook: foto de perfil (recorte da capa do ebook) e capa (recorte da arte que o Gustavo faz no GPT).
// Uso, de dentro de facebook/: node montar-imagens.mjs [deslocamento]
// O deslocamento (em %, padrão 0) sobe (negativo) ou desce (positivo) a faixa da capa dentro da arte do GPT.
import { foto } from "../comum.mjs";
import { writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const aqui = import.meta.dirname;
const url = arquivo => pathToFileURL(join(aqui, arquivo)).href;
// largura e altura de um PNG, lidas do cabeçalho (IHDR)
const medidas = arquivo => { const b = readFileSync(join(aqui, arquivo)); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

// Recorta o retângulo (x, y, largura, altura) da imagem e grava em saida com w x h.
function recortar(arquivo, [x, y, cw, ch], w, h, saida) {
  const [W] = medidas(arquivo), s = w / cw, tmp = join(aqui, "_recorte.html");
  writeFileSync(tmp, `<!doctype html><body style="margin:0;width:${w}px;height:${h}px;overflow:hidden;position:relative">
<img src="${url(arquivo)}" style="position:absolute;left:${-x * s}px;top:${-y * s}px;width:${W * s}px"></body>`);
  foto(pathToFileURL(tmp).href, join(aqui, saida), w, h);
  rmSync(tmp);
  console.log(saida, `${w}x${h}`);
}

// Foto de perfil: o título "Natal Mágico" da capa do livro no mockup (1254x1254). O Facebook mostra em círculo.
recortar("../Mockup do eBook Natal Mágico.png", [155, 95, 560, 560], 720, 720, "foto-perfil.png");

// Capa: 1640x624 (o celular mostra só o meio, uns 1110x624). Recorta a largura toda da arte do GPT, na faixa do meio.
if (existsSync(join(aqui, "capa-gpt.png"))) {
  const [W, H] = medidas("capa-gpt.png"), ch = Math.round(W * 624 / 1640);
  const y = Math.max(0, Math.min(H - ch, Math.round((H - ch) / 2 + H * (Number(process.argv[2]) || 0) / 100)));
  recortar("capa-gpt.png", [0, y, W, ch], 1640, 624, "capa-facebook.png");
} else console.log("capa: falta salvar a arte do GPT como facebook/capa-gpt.png");
