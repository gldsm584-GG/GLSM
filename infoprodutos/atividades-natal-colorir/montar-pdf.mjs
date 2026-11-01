// Junta as imagens .png de uma pasta num PDF A4, uma por página.
// Uso (nesta pasta): node montar-pdf.mjs <pasta> <saida.pdf>
//   node montar-pdf.mjs desenhos "entregaveis/1 - Desenhos para colorir.pdf"
//   node montar-pdf.mjs moldes "entregaveis/2 - Moldes para recortar.pdf"
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { homedir } from "node:os";

const [pasta, saida] = process.argv.slice(2).map(p => resolve(p));
if (!pasta || !saida) throw new Error('uso: node montar-pdf.mjs <pasta> <saida.pdf>');
const CHROME = join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe");

// os numerados primeiro, na ordem do número; depois os outros em ordem alfabética
const num = f => +(f.match(/(\d+)\.png$/) || [, Infinity])[1];
const imagens = readdirSync(pasta).filter(f => f.endsWith(".png")).sort((a, b) => num(a) - num(b) || a.localeCompare(b, "pt"));
if (!imagens.length) throw new Error("nenhum .png em " + pasta);

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Natal Mágico</title>
<style>
  @page { size: A4; margin: 0; }
  body { margin: 0; }
  .pag { width: 210mm; height: 297mm; padding: 10mm 12mm 6mm; display: flex; flex-direction: column; align-items: center; break-after: page; }
  /* brightness leva o fundo quase branco que o GPT deixa em volta do desenho para branco puro */
  .pag img { flex: 1; min-height: 0; width: 100%; object-fit: contain; filter: brightness(1.05); }
  .pag p { margin: 3mm 0 0; font: 11px sans-serif; color: #aaa; }
</style></head><body>
${imagens.map(f => `<section class="pag"><img src="${encodeURI(f)}" alt=""><p>Natal Mágico</p></section>`).join("\n")}
</body></html>`;

const tmp = join(pasta, "_montar-pdf.html");
writeFileSync(tmp, html);
mkdirSync(dirname(saida), { recursive: true });
execFileSync(CHROME, ["--headless", "--disable-gpu", "--virtual-time-budget=15000", "--no-pdf-header-footer", "--print-to-pdf=" + saida, pathToFileURL(tmp).href], { stdio: "ignore" });
rmSync(tmp);
console.log(imagens.length, "imagens ->", saida);
imagens.forEach((f, k) => console.log(" ", k + 1, f));
