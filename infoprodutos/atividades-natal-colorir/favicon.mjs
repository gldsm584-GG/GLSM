// Favicon da página de venda: o rosto do Papai Noel dos order bumps (caixinhas/arte/papai-noel-adesivo.png,
// com a borda branca de adesivo) sobre um quadrado verde de cantos redondos, nas cores da página.
// Gera em pagina-de-venda/: favicon.ico (16, 32 e 48 px), favicon.png (192 px) e apple-touch-icon.png (180 px,
// sem cantos transparentes, porque o iPhone arredonda sozinho).
// Uso (nesta pasta): node favicon.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { CHROME, VERDE, DOURADO } from "./comum.mjs";

const AQUI = import.meta.dirname;
const SAIDA = join(AQUI, "pagina-de-venda");
const arte = "data:image/png;base64," + readFileSync(join(AQUI, "caixinhas", "arte", "papai-noel-adesivo.png")).toString("base64");

// Medidas em fração do lado, para sair igual em qualquer tamanho. O adesivo (900x900) fica um pouco maior que o
// quadrado e é cortado embaixo: o gorro com o pompom, o rosto e a barba inteiros, e só a ponta do presente.
// Até 32 px (a aba do navegador) o rosto vem mais perto e sem a borda dourada, senão vira borrão.
const pagina = (lado, cantos) => {
  const perto = lado <= 32;
  const [larg, esq, topo] = perto ? [1.4, -0.2, -0.02] : [1.08, -0.06, 0.03];
  return `<!doctype html><html><body style="margin:0;background:transparent">
<div style="position:relative;width:${lado}px;height:${lado}px;overflow:hidden;border-radius:${cantos ? lado * 0.22 : 0}px;
  background:radial-gradient(circle at 50% 38%, #2a7a52, ${VERDE} 70%);box-shadow:${perto ? "none" : `inset 0 0 0 ${lado * 0.035}px ${DOURADO}`}">
  <img src="${arte}" style="position:absolute;width:${lado * larg}px;left:${lado * esq}px;top:${lado * topo}px">
</div></body></html>`;
};

function foto(lado, cantos, saida) {
  const html = join(AQUI, "_favicon.html");
  writeFileSync(html, pagina(lado, cantos));
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", "--default-background-color=00000000",
    `--window-size=${lado},${lado}`, "--virtual-time-budget=3000", "--screenshot=" + saida, pathToFileURL(html).href], { stdio: "ignore" });
  rmSync(html);
  return readFileSync(saida);
}

// .ico com PNGs dentro (aceito por todos os navegadores atuais): cabeçalho de 6 bytes + 16 bytes por imagem.
function ico(pngs) {
  const cab = Buffer.alloc(6 + 16 * pngs.length);
  cab.writeUInt16LE(1, 2);
  cab.writeUInt16LE(pngs.length, 4);
  let pos = cab.length;
  pngs.forEach(({ lado, dados }, i) => {
    const o = 6 + 16 * i;
    cab.writeUInt8(lado % 256, o);
    cab.writeUInt8(lado % 256, o + 1);
    cab.writeUInt16LE(1, o + 4);
    cab.writeUInt16LE(32, o + 6);
    cab.writeUInt32LE(dados.length, o + 8);
    cab.writeUInt32LE(pos, o + 12);
    pos += dados.length;
  });
  return Buffer.concat([cab, ...pngs.map((p) => p.dados)]);
}

const tmp = join(AQUI, "_favicon.png");
const pngs = [16, 32, 48].map((lado) => ({ lado, dados: foto(lado, true, tmp) }));
rmSync(tmp);
writeFileSync(join(SAIDA, "favicon.ico"), ico(pngs));
foto(192, true, join(SAIDA, "favicon.png"));
foto(180, false, join(SAIDA, "apple-touch-icon.png"));
console.log("pagina-de-venda/: favicon.ico, favicon.png, apple-touch-icon.png");
