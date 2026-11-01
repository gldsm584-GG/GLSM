// Monta as atividades do Natal Mágico (A4) a partir dos desenhos recortados em icones/ (gerar-icones.mjs).
// Gera atividades.html, ../entregaveis/3 - Atividades.pdf e previa/p<N>.png. Uso: node montar.mjs   (dentro desta pasta)
// Caça-palavras, labirinto, sudoku e contagem são sorteados com semente fixa e conferidos antes de gerar.
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { homedir } from "node:os";
import assert from "node:assert/strict";

const AQUI = dirname(fileURLToPath(import.meta.url));
const CHROME = join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe");

// nome -> arquivo em icones/ (ver a folha de contato ao rodar gerar-icones.mjs)
const I = {
  vela: "f1-1", anjo: "f1-2", estrelaLaco: "f1-3", treno: "f1-4", gorro: "f1-5",
  urso: "f2-1", sinos: "f2-2", pinguimSentado: "f2-3", renaSentada: "f2-4", globo: "f2-5",
  rena: "f3-1", papaiNoel: "f3-2", presente: "f3-3", arvore: "f3-4", biscoito: "f3-5",
  pinguim: "f4-1", guirlanda: "f4-2", casa: "f4-3", bengala: "f4-4", luva: "f4-5",
  // grade de 9 ícones limpos (atividade 9/); estrela, sino, boneco e meia vêm daqui (a folha de enfeites com alça saiu do kit)
  arvoreSimples: "g1-1", estrelaSimples: "g1-2", sinoSimples: "g1-3", papaiNoelSimples: "g1-4", renaSimples: "g1-5",
  presenteSimples: "g1-6", bonecoSimples: "g1-7", bengalaSimples: "g1-8", meiaSimples: "g1-9",
  estrela: "g1-2", sino: "g1-3", boneco: "g1-7", meia: "g1-9",
};
const img = (n, estilo = "", sombra = false) => `<img src="icones/${I[n]}${sombra ? "-sombra" : ""}.png" style="${estilo}" alt="">`;

// sorteio com semente: o PDF sai igual toda vez
function sorteio(semente) {
  let a = semente;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const rnd = sorteio(2026);
const inteiro = n => Math.floor(rnd() * n);
const embaralhar = arr => { const a = [...arr]; for (let k = a.length - 1; k > 0; k--) { const j = inteiro(k + 1); [a[k], a[j]] = [a[j], a[k]]; } return a; };

// ---------- 1. Caça-palavras ----------
function cacaPalavras(palavras, N) {
  const LETRAS = "ABCDEFGHIJLMNOPRSTUVZ";
  for (let tentativa = 0; tentativa < 500; tentativa++) {
    const g = Array.from({ length: N }, () => Array(N).fill(""));
    const colocou = [...palavras].sort((a, b) => b.length - a.length).every(w => {
      for (let t = 0; t < 300; t++) {
        const vert = rnd() < 0.5, r = inteiro(vert ? N - w.length + 1 : N), c = inteiro(vert ? N : N - w.length + 1);
        const casas = [...w].map((_, k) => [r + (vert ? k : 0), c + (vert ? 0 : k)]);
        if (casas.every(([y, x]) => !g[y][x])) { casas.forEach(([y, x], k) => (g[y][x] = w[k])); return true; }
      }
      return false;
    });
    if (!colocou) continue;
    g.forEach(l => l.forEach((v, k) => { if (!v) l[k] = LETRAS[inteiro(LETRAS.length)]; }));
    // cada palavra aparece uma vez só, na horizontal ou na vertical (sem diagonal nem de trás pra frente)
    const linhas = [...g.map(l => l.join("")), ...g[0].map((_, c) => g.map(l => l[c]).join(""))];
    const vezes = w => linhas.reduce((n, l) => n + l.split(w).length - 1, 0);
    if (palavras.every(w => vezes(w) === 1)) return g;
  }
  throw new Error("caça-palavras não fechou");
}
const PALAVRAS = [["NATAL", "arvore"], ["NEVE", "boneco"], ["SINO", "sino"], ["RENA", "rena"], ["ESTRELA", "estrela"], ["PRESENTE", "presente"], ["VELA", "vela"], ["GORRO", "gorro"]];
const grade = cacaPalavras(PALAVRAS.map(p => p[0]), 10);

// ---------- 2. Labirinto ----------
function labirinto(C, R) {
  const h = Array.from({ length: R + 1 }, () => Array(C).fill(true)); // parede em cima da casa (r, c)
  const v = Array.from({ length: R }, () => Array(C + 1).fill(true)); // parede à esquerda da casa (r, c)
  const vis = Array.from({ length: R }, () => Array(C).fill(false));
  const pilha = [[0, 0]]; vis[0][0] = true;
  while (pilha.length) {
    const [r, c] = pilha.at(-1);
    const viz = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([y, x]) => y >= 0 && y < R && x >= 0 && x < C && !vis[y][x]);
    if (!viz.length) { pilha.pop(); continue; }
    const [y, x] = viz[inteiro(viz.length)];
    if (y < r) h[r][c] = false; else if (y > r) h[y][x] = false; else if (x < c) v[r][c] = false; else v[r][x] = false;
    vis[y][x] = true; pilha.push([y, x]);
  }
  h[0][0] = false; h[R][C - 1] = false; // entrada em cima à esquerda, saída embaixo à direita
  // confere: da entrada dá para chegar na saída
  const visto = new Set(["0,0"]), fila = [[0, 0]];
  while (fila.length) {
    const [r, c] = fila.shift();
    for (const [y, x, aberto] of [[r - 1, c, !h[r][c]], [r + 1, c, !h[r + 1][c]], [r, c - 1, !v[r][c]], [r, c + 1, !v[r][c + 1]]])
      if (aberto && y >= 0 && y < R && x >= 0 && x < C && !visto.has(y + "," + x)) { visto.add(y + "," + x); fila.push([y, x]); }
  }
  assert.ok(visto.has(`${R - 1},${C - 1}`) && visto.size === R * C, "labirinto sem saída");
  return { h, v, C, R };
}
const lab = labirinto(9, 10);

// ---------- 5. Sudoku 4x4 ----------
const BASE = [[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]];
function solucoes(g, limite = 2) {
  const k = g.flat().indexOf(-1); if (k < 0) return 1;
  const r = (k / 4) | 0, c = k % 4; let n = 0;
  for (let s = 0; s < 4 && n < limite; s++) {
    const br = r - (r % 2), bc = c - (c % 2);
    const pode = !g[r].includes(s) && !g.some(l => l[c] === s) && ![0, 1].some(i => [0, 1].some(j => g[br + i][bc + j] === s));
    if (pode) { g[r][c] = s; n += solucoes(g, limite - n); g[r][c] = -1; }
  }
  return n;
}
const SIMBOLOS = embaralhar(["estrela", "sino", "arvore", "presente"]);
const sudoku = BASE.map(l => [...l]);
for (const k of embaralhar([...Array(16).keys()])) {
  if (sudoku.flat().filter(v => v < 0).length === 8) break;
  const r = (k / 4) | 0, c = k % 4, antes = sudoku[r][c]; sudoku[r][c] = -1;
  if (solucoes(sudoku.map(l => [...l])) !== 1) sudoku[r][c] = antes;
}
assert.equal(solucoes(sudoku.map(l => [...l])), 1, "sudoku com mais de uma resposta");
const faltam = sudoku.flatMap((l, r) => l.map((v, c) => (v < 0 ? BASE[r][c] : null))).filter(v => v !== null);

// ---------- 4. Conte ----------
const CONTA = [["estrela", 4], ["sino", 3], ["presente", 5], ["bengala", 2]];
const casasConta = embaralhar([...Array(24).keys()]).slice(0, CONTA.reduce((n, [, q]) => n + q, 0));
const itensConta = CONTA.flatMap(([n, q]) => Array(q).fill(n)).map((n, k) => ({ n, casa: casasConta[k], dx: rnd() * 6 - 3, dy: rnd() * 6 - 3, rot: rnd() * 24 - 12 }));
CONTA.forEach(([n, q]) => assert.equal(itensConta.filter(i => i.n === n).length, q));

// ---------- 6. Memória e 7. Bingo ----------
const PARES = ["papaiNoel", "rena", "boneco", "pinguim", "arvore", "presente", "sino", "estrela", "meia", "bengala", "guirlanda", "biscoito"];
const cartasMemoria = embaralhar([...PARES, ...PARES]);
const BINGO = [...PARES, "gorro", "vela", "luva"];
const cartelas = [];
while (cartelas.length < 4) {
  const c = embaralhar(BINGO).slice(0, 9), chave = [...c].sort().join();
  if (!cartelas.some(x => [...x].sort().join() === chave)) cartelas.push(c);
}

// ---------- 3. Sombras ----------
const SOMBRAS = ["arvore", "boneco", "meia", "presente", "bengala"];
let ordemSombras; do ordemSombras = embaralhar(SOMBRAS); while (ordemSombras.some((n, k) => n === SOMBRAS[k]));

// ---------- 9. Complete o desenho ----------
// eixo de simetria (fração da largura) medido espelhando o traço de cada desenho; estes 6 erram menos de 6%
const METADES = [["estrelaSimples", 0.4928], ["arvoreSimples", 0.5054], ["sinoSimples", 0.502], ["presenteSimples", 0.5], ["renaSimples", 0.5016], ["biscoito", 0.5034]];
const tamanho = n => { const b = readFileSync(join(AQUI, "icones", I[n] + ".png")); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const metade = ([n, eixo]) => {
  const [w, h] = tamanho(n), alt = 56, larg = (alt * w) / h;
  return `<div class="metade"><div class="corte" style="width:${(eixo * larg).toFixed(2)}mm;height:${alt}mm">${img(n, `width:${larg.toFixed(2)}mm;height:${alt}mm;max-width:none`)}</div></div>`;
};

// ---------- 9. Enfeites para colar na árvore ----------
const ENFEITES = embaralhar([
  "anjo", "guirlanda", "estrelaLaco", ...Array(3).fill("estrelaSimples"), ...Array(3).fill("sinoSimples"), ...Array(3).fill("presenteSimples"),
  ...Array(2).fill("bengalaSimples"), ...Array(2).fill("meiaSimples"), ...Array(2).fill("biscoito"), "estrelaLaco", "sinos",
]);

// ---------- HTML ----------
let numero = 0;
let paginas = 0;
const pagina = (titulo, instrucao, corpo, continua = false) => `
<section class="pag">${(paginas++, "")}
  <p class="rotulo">Atividade ${continua ? numero : ++numero}</p>
  <h1>${titulo}</h1>
  <p class="inst">${instrucao}</p>
  <div class="corpo">${corpo}</div>
  <p class="rodape">Natal Mágico</p>
</section>`;

const CEL = 15; // mm
const svgLab = (() => {
  const { h, v, C, R } = lab, s = 18, m = 2;
  const linhas = [];
  h.forEach((l, r) => l.forEach((p, c) => p && linhas.push([c * s, r * s, (c + 1) * s, r * s])));
  v.forEach((l, r) => l.forEach((p, c) => p && linhas.push([c * s, r * s, c * s, (r + 1) * s])));
  return `<svg width="${C * s + 2 * m}mm" height="${R * s + 2 * m}mm" viewBox="${-m} ${-m} ${C * s + 2 * m} ${R * s + 2 * m}">
    ${linhas.map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`).join("")}</svg>`;
})();

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Natal Mágico · Atividades</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Nunito, sans-serif; color: #222; background: #fff; }
  .pag { width: 210mm; height: 297mm; padding: 12mm 14mm 8mm; display: flex; flex-direction: column; break-after: page; overflow: hidden; }
  .rotulo { margin: 0; text-align: center; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #888; }
  h1 { font: 600 32px/1.15 Fredoka, sans-serif; text-align: center; margin: 1mm 0 2mm; }
  .inst { text-align: center; font-size: 16px; font-weight: 600; margin: 0 0 6mm; }
  .corpo { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8mm; min-height: 0; }
  .rodape { margin: 0; text-align: center; font-size: 11px; color: #aaa; }
  img { display: block; object-fit: contain; }

  .caca { border-collapse: collapse; border: 2.5px solid #222; }
  .caca td { width: ${CEL}mm; height: ${CEL}mm; border: 1px solid #bbb; text-align: center; font: 600 26px Fredoka, sans-serif; }
  .lista { display: grid; grid-template-columns: repeat(4, auto); gap: 4mm 9mm; }
  .lista span { display: flex; align-items: center; gap: 2mm; font: 600 18px Fredoka, sans-serif; letter-spacing: .06em; }

  .lab svg line { stroke: #222; stroke-width: 2.2; stroke-linecap: round; }
  .lab { display: grid; grid-template-columns: auto; justify-items: start; }
  .lab .fim { justify-self: end; }

  .sombras { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm 40mm; }
  .sombras div { display: flex; align-items: center; gap: 5mm; height: 38mm; }
  .sombras div:nth-child(even) { flex-direction: row-reverse; }
  .ponto { width: 4mm; height: 4mm; border-radius: 50%; background: #222; flex: 0 0 auto; }

  .conta { position: relative; width: 182mm; height: 128mm; border: 2.5px solid #222; border-radius: 6mm; }
  .conta img { position: absolute; width: 22mm; height: 22mm; }
  .respostas { display: flex; justify-content: space-between; width: 170mm; }
  .respostas div { display: flex; align-items: center; justify-content: center; gap: 3mm; font: 600 28px Fredoka, sans-serif; }
  .caixa { width: 15mm; height: 15mm; border: 2.5px solid #222; border-radius: 3mm; }

  .sudoku { display: grid; grid-template-columns: repeat(4, 34mm); border: 3px solid #222; }
  .sudoku div { height: 34mm; border: 1px solid #999; display: flex; align-items: center; justify-content: center; }
  .sudoku div:nth-child(4n+2) { border-right: 3px solid #222; }
  .sudoku div:nth-child(n+5):nth-child(-n+8) { border-bottom: 3px solid #222; }
  .recortar { display: grid; grid-template-columns: repeat(8, 21mm); border-top: 1.5px dashed #555; border-left: 1.5px dashed #555; }
  .recortar div { height: 21mm; border-right: 1.5px dashed #555; border-bottom: 1.5px dashed #555; display: flex; align-items: center; justify-content: center; }

  .cartas { display: grid; grid-template-columns: repeat(4, 44mm); border-top: 1.5px dashed #555; border-left: 1.5px dashed #555; }
  .cartas div { height: 37mm; border-right: 1.5px dashed #555; border-bottom: 1.5px dashed #555; display: flex; align-items: center; justify-content: center; }

  .cartelas { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm 10mm; }
  .cartela { border: 2.5px solid #222; border-radius: 4mm; padding: 3mm; }
  .cartela p { margin: 0 0 2mm; text-align: center; font: 600 22px Fredoka, sans-serif; letter-spacing: .3em; }
  .cartela .g { display: grid; grid-template-columns: repeat(3, 26mm); border-top: 1px solid #999; border-left: 1px solid #999; }
  .cartela .g div { height: 26mm; border-right: 1px solid #999; border-bottom: 1px solid #999; display: flex; align-items: center; justify-content: center; }
  .fichas { display: grid; grid-template-columns: repeat(5, 34mm); border-top: 1.5px dashed #555; border-left: 1.5px dashed #555; }
  .fichas div { height: 34mm; border-right: 1.5px dashed #555; border-bottom: 1.5px dashed #555; display: flex; align-items: center; justify-content: center; }

  .enfeites { display: grid; grid-template-columns: repeat(4, 43mm); grid-auto-rows: 43mm; gap: 2mm; }
  .enfeites img { width: 100%; height: 100%; }
  .metades { display: grid; grid-template-columns: repeat(2, 84mm); gap: 7mm 10mm; }
  .metade { position: relative; height: 70mm; border: 2.5px solid #222; border-radius: 5mm; }
  .metade::after { content: ""; position: absolute; left: 50%; top: 2mm; bottom: 2mm; border-left: 1.8px dashed #444; }
  .corte { position: absolute; right: 50%; top: 50%; transform: translateY(-50%); overflow: hidden; }
  .carta { width: 182mm; display: flex; flex-direction: column; gap: 5mm; font-size: 18px; font-weight: 700; }
  .linha { border-bottom: 1.5px solid #555; height: 11mm; }
  .desenho { height: 70mm; border: 2.5px dashed #555; border-radius: 6mm; display: flex; align-items: flex-start; justify-content: center; padding-top: 3mm; color: #777; font-size: 15px; }
  .cantos { display: flex; justify-content: space-between; align-items: flex-end; }
</style></head><body>

${pagina("Caça-palavras de Natal", "Encontre as 8 palavras escondidas. Elas estão deitadas ou em pé.", `
  <table class="caca">${grade.map(l => `<tr>${l.map(ch => `<td>${ch}</td>`).join("")}</tr>`).join("")}</table>
  <div class="lista">${PALAVRAS.map(([w, n]) => `<span>${img(n, "width:12mm;height:12mm")}${w}</span>`).join("")}</div>`)}

${pagina("Labirinto do Papai Noel", "Ajude o Papai Noel a chegar até o presente.", `
  <div class="lab">${img("papaiNoel", "width:26mm;height:26mm;margin-left:-2mm")}${svgLab}<div class="fim">${img("presente", "width:24mm;height:24mm;margin-right:-1mm")}</div></div>`)}

${pagina("Qual é a sombra?", "Ligue cada desenho à sua sombra.", `
  <div class="sombras">${SOMBRAS.map((n, k) => `
    <div>${img(n, "width:34mm;height:34mm")}<span class="ponto"></span></div>
    <div>${img(ordemSombras[k], "width:34mm;height:34mm", true)}<span class="ponto"></span></div>`).join("")}</div>`)}

${pagina("Conte os enfeites", "Conte quantos tem de cada desenho e escreva o número na caixinha.", `
  <div class="conta">${itensConta.map(({ n, casa, dx, dy, rot }) => {
    const col = casa % 6, lin = (casa / 6) | 0;
    return img(n, `left:${6 + col * 29 + dx}mm;top:${6 + lin * 30 + dy}mm;transform:rotate(${rot}deg)`);
  }).join("")}</div>
  <div class="respostas">${CONTA.map(([n]) => `<div>${img(n, "width:15mm;height:15mm")}=<span class="caixa"></span></div>`).join("")}</div>`)}

${pagina("Sudoku de Natal", "Cada fileira, cada coluna e cada quadrado grande tem um de cada desenho. Recorte as figuras de baixo e cole nos espaços vazios, ou desenhe.", `
  <div class="sudoku">${sudoku.flat().map(v => `<div>${v < 0 ? "" : img(SIMBOLOS[v], "width:26mm;height:26mm")}</div>`).join("")}</div>
  <div class="recortar">${faltam.map(v => `<div>${img(SIMBOLOS[v], "width:16mm;height:16mm")}</div>`).join("")}</div>`)}

${pagina("Jogo da memória", "Pinte as cartas, recorte na linha pontilhada e brinque de achar os pares.", `
  <div class="cartas">${cartasMemoria.map(n => `<div>${img(n, "width:28mm;height:28mm")}</div>`).join("")}</div>`)}

${pagina("Bingo de Natal", "Cada um pega uma cartela. Quando o desenho sorteado sair, marque com um feijão ou pinte. Quem completar a cartela grita BINGO!", `
  <div class="cartelas">${cartelas.map(c => `<div class="cartela"><p>BINGO</p><div class="g">${c.map(n => `<div>${img(n, "width:20mm;height:20mm")}</div>`).join("")}</div></div>`).join("")}</div>`)}

${pagina("Fichas do bingo", "Recorte as fichas, coloque num saquinho e sorteie uma de cada vez.", `
  <div class="fichas">${BINGO.map(n => `<div>${img(n, "width:26mm;height:26mm")}</div>`).join("")}</div>`, true)}

${pagina("Cartinha para o Papai Noel", "Escreva ou peça ajuda para um adulto. Depois, desenhe o seu pedido.", `
  <div class="carta">
    <div class="cantos">${img("estrela", "width:16mm;height:16mm")}${img("papaiNoel", "width:30mm;height:30mm")}${img("presente", "width:16mm;height:16mm")}</div>
    <div>Querido Papai Noel,</div>
    <div>Meu nome é <span style="display:inline-block;width:80mm;border-bottom:1.5px solid #555"></span> e eu tenho <span style="display:inline-block;width:14mm;border-bottom:1.5px solid #555"></span> anos.</div>
    <div class="linha"></div><div class="linha"></div><div class="linha"></div><div class="linha"></div>
    <div class="desenho">Desenhe aqui o que você quer ganhar</div>
    <div>Com carinho, <span style="display:inline-block;width:100mm;border-bottom:1.5px solid #555"></span></div>
  </div>`)}

${pagina("Decore a árvore", "Pinte e recorte os enfeites da próxima página e cole na árvore. Se quiser, desenhe mais enfeites!", `
  <img src="${encodeURI("atividade 9/Árvore de Natal para Colorir.png")}" style="height:222mm;width:auto;filter:brightness(1.05)" alt="">`)}

${pagina("Enfeites para a árvore", "Pinte os enfeites, recorte na linha pontilhada e cole na árvore.", `
  <div class="enfeites">${ENFEITES.map(n => `<img src="icones/${I[n]}-recorte.png" alt="">`).join("")}</div>`, true)}

${pagina("Complete o desenho", "Desenhe a outra metade de cada figura, do outro lado da linha pontilhada. Depois, pinte!", `
  <div class="metades">${METADES.map(metade).join("")}</div>`)}

<script>
  // previa: #p3 mostra só a página 3
  const n = +location.hash.slice(2); if (n) document.querySelectorAll(".pag").forEach((p, k) => { if (k + 1 !== n) p.remove(); });
</script>
</body></html>`;

writeFileSync(join(AQUI, "atividades.html"), html);
const url = pathToFileURL(join(AQUI, "atividades.html")).href;
execFileSync(CHROME, ["--headless", "--disable-gpu", "--virtual-time-budget=10000", "--no-pdf-header-footer", "--print-to-pdf=" + join(AQUI, "..", "entregaveis", "3 - Atividades.pdf"), url], { stdio: "ignore" });
mkdirSync(join(AQUI, "previa"), { recursive: true });
for (let p = 1; p <= paginas; p++)
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=8000", "--window-size=794,1123", "--screenshot=" + join(AQUI, "previa", `p${p}.png`), url + "#p" + p], { stdio: "ignore" });
console.log(numero, "atividades em", paginas, "páginas -> entregaveis/3 - Atividades.pdf e previa/");
