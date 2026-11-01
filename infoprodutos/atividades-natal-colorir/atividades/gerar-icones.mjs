// Recorta cada desenho das folhas de moldes, tira a linha pontilhada (mais fina que o traço) e salva
// icones/<folha>-<n>.png (traço preto com fundo transparente) e icones/<folha>-<n>-sombra.png (silhueta cheia).
// Uso: node gerar-icones.mjs [--medir]   (dentro desta pasta)
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { homedir, tmpdir } from "node:os";

const AQUI = dirname(fileURLToPath(import.meta.url));
const MOLDES = join(AQUI, "..", "moldes");
const CHROME = join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe");
const MEDIR = process.argv.includes("--medir");

// Roda dentro do Chromium: tudo em canvas, sem dependência.
function processar(MEDIR) {
  const i = document.querySelector("img"), W = i.naturalWidth, H = i.naturalHeight;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d"); x.drawImage(i, 0, 0);
  const px = x.getImageData(0, 0, W, H).data;
  const cinza = new Uint8Array(W * H); for (let k = 0; k < W * H; k++) cinza[k] = px[k * 4];
  const escuro = new Uint8Array(W * H); for (let k = 0; k < W * H; k++) escuro[k] = cinza[k] < 140 ? 1 : 0;
  if (MEDIR) { // largura das corridas horizontais de preto: traço x pontilhado
    const h = {}; for (let y = 0; y < H; y++) { let n = 0; for (let xx = 0; xx <= W; xx++) { if (xx < W && escuro[y * W + xx]) n++; else if (n) { h[n] = (h[n] || 0) + 1; n = 0; } } }
    return JSON.stringify(h);
  }
  // min/max quadrado separável: erosão (op=min) ou dilatação (op=max) de raio r
  const filtro = (src, r, max) => {
    const tmp = new Uint8Array(W * H), out = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) { let v = max ? 0 : 1; for (let d = -r; d <= r; d++) { const q = xx + d; const s = q < 0 || q >= W ? 0 : src[y * W + q]; v = max ? v | s : v & s; } tmp[y * W + xx] = v; }
    for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) { let v = max ? 0 : 1; for (let d = -r; d <= r; d++) { const q = y + d; const s = q < 0 || q >= H ? 0 : tmp[q * W + xx]; v = max ? v | s : v & s; } out[y * W + xx] = v; }
    return out;
  };
  const R = RAIO;
  const traco = filtro(filtro(escuro, R, false), R, true);   // abertura: some o pontilhado fino
  const manter = filtro(traco, 2, true);                       // devolve o antisserrilhado da borda do traço
  // agrupa partes do mesmo desenho (olhos, botões) dilatando bastante e rotulando
  const junto = filtro(traco, JUNTO, true), rot = new Int32Array(W * H); const caixas = [];
  for (let k = 0; k < W * H; k++) if (junto[k] && !rot[k]) {
    const id = caixas.length + 1, pilha = [k]; rot[k] = id; let x0 = W, y0 = H, x1 = 0, y1 = 0, n = 0;
    while (pilha.length) { const p = pilha.pop(), py = (p / W) | 0, pxx = p % W; n++;
      if (pxx < x0) x0 = pxx; if (pxx > x1) x1 = pxx; if (py < y0) y0 = py; if (py > y1) y1 = py;
      for (const q of [p - 1, p + 1, p - W, p + W]) if (q >= 0 && q < W * H && junto[q] && !rot[q] && Math.abs((q % W) - pxx) <= 1) { rot[q] = id; pilha.push(q); } }
    caixas.push({ id, x0, y0, x1, y1, n });
  }
  const grandes = new Set(caixas.filter(b => b.n > 20000).map(b => b.id));
  const saida = [];
  for (const b of caixas.filter(b => b.n > 20000).sort((a, b) => (a.y0 - b.y0) || (a.x0 - b.x0))) {
    const pad = 6, X0 = Math.max(0, b.x0 - pad), Y0 = Math.max(0, b.y0 - pad), w = Math.min(W - 1, b.x1 + pad) - X0 + 1, h = Math.min(H - 1, b.y1 + pad) - Y0 + 1;
    const ic = document.createElement("canvas"); ic.width = w; ic.height = h; const ix = ic.getContext("2d"); const id = ix.createImageData(w, h);
    const sc = document.createElement("canvas"); sc.width = w; sc.height = h; const sx = sc.getContext("2d"); const sd = sx.createImageData(w, h);
    // fora = branco alcançável a partir da borda do recorte sem cruzar o traço
    const fora = new Uint8Array(w * h), pilha = [];
    const ehTraco = (xx, yy) => manter[(Y0 + yy) * W + X0 + xx] && (rot[(Y0 + yy) * W + X0 + xx] === b.id || !grandes.has(rot[(Y0 + yy) * W + X0 + xx]));
    for (let xx = 0; xx < w; xx++) { pilha.push(xx, (h - 1) * w + xx); } for (let yy = 0; yy < h; yy++) { pilha.push(yy * w, yy * w + w - 1); }
    while (pilha.length) { const p = pilha.pop(); if (fora[p]) continue; const xx = p % w, yy = (p / w) | 0; if (ehTraco(xx, yy)) continue; fora[p] = 1;
      if (xx > 0) pilha.push(p - 1); if (xx < w - 1) pilha.push(p + 1); if (yy > 0) pilha.push(p - w); if (yy < h - 1) pilha.push(p + w); }
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const p = yy * w + xx, g = (Y0 + yy) * W + X0 + xx, a = ehTraco(xx, yy) ? 255 - cinza[g] : 0;
      id.data[p * 4 + 3] = a;                                   // traço preto, fundo transparente
      sd.data[p * 4 + 3] = fora[p] ? 0 : 255;                   // silhueta cheia
    }
    ix.putImageData(id, 0, 0); sx.putImageData(sd, 0, 0);
    // recorte: o desenho com uma linha pontilhada seguindo o contorno, um pouco afastada da silhueta
    const lado = Math.max(w, h), M = Math.round(lado * 0.09), RW = w + 2 * M, RH = h + 2 * M;
    const dist = new Float32Array(RW * RH).fill(1e9);
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (!fora[yy * w + xx]) dist[(yy + M) * RW + xx + M] = 0;
    for (let yy = 0; yy < RH; yy++) for (let xx = 0; xx < RW; xx++) { const p = yy * RW + xx; let d = dist[p]; // chanfro 1/√2, ida
      if (xx > 0) d = Math.min(d, dist[p - 1] + 1); if (yy > 0) { d = Math.min(d, dist[p - RW] + 1); if (xx > 0) d = Math.min(d, dist[p - RW - 1] + 1.414); if (xx < RW - 1) d = Math.min(d, dist[p - RW + 1] + 1.414); } dist[p] = d; }
    for (let yy = RH - 1; yy >= 0; yy--) for (let xx = RW - 1; xx >= 0; xx--) { const p = yy * RW + xx; let d = dist[p]; // volta
      if (xx < RW - 1) d = Math.min(d, dist[p + 1] + 1); if (yy < RH - 1) { d = Math.min(d, dist[p + RW] + 1); if (xx < RW - 1) d = Math.min(d, dist[p + RW + 1] + 1.414); if (xx > 0) d = Math.min(d, dist[p + RW - 1] + 1.414); } dist[p] = d; }
    const afasta = lado * 0.05, grossura = Math.max(2, lado * 0.011), cx = M + w / 2, cy = M + h / 2;
    let faixa = 0; for (let p = 0; p < RW * RH; p++) if (dist[p] >= afasta && dist[p] < afasta + grossura) faixa++;
    const tracos = Math.max(12, Math.round(faixa / grossura / (lado * 0.035) / 2)); // pares traço+vão ao redor
    const rc = document.createElement("canvas"); rc.width = RW; rc.height = RH; const rx = rc.getContext("2d"); const rd = rx.createImageData(RW, RH);
    for (let yy = 0; yy < RH; yy++) for (let xx = 0; xx < RW; xx++) { const p = yy * RW + xx;
      if (dist[p] < afasta || dist[p] >= afasta + grossura) continue;
      const ang = (Math.atan2(yy - cy, xx - cx) + Math.PI) / (2 * Math.PI); // 0..1 ao redor do centro
      if (Math.floor(ang * tracos * 2) % 2 === 0) rd.data[p * 4 + 3] = 255; }
    rx.putImageData(rd, 0, 0); rx.drawImage(ic, M, M);
    saida.push({ w, h, icone: ic.toDataURL("image/png"), sombra: sc.toDataURL("image/png"), recorte: rc.toDataURL("image/png") });
  }
  return JSON.stringify(saida);
}

const tmp = join(tmpdir(), "gerar-icones.html");
// folhas em que dois desenhos ficaram perto demais: agrupa com raio menor para não juntar os dois
const JUNTO = { "Recortes Natalinos para Colorir.png": 7 };
// folhas f* são os moldes (com pontilhado); a g1 é a grade de 9 ícones limpos, sem pontilhado para tirar (RAIO 0)
const GRADE = join(AQUI, "atividade 9", "Grade natalina com ícones festivos em preto.png");
const folhas = [
  ...readdirSync(MOLDES).filter(f => f.endsWith(".png")).sort().map((f, fi) => ({ arq: join(MOLDES, f), f, prefixo: `f${fi + 1}`, raio: 3 })),
  { arq: GRADE, f: "grade", prefixo: "g1", raio: 0 },
];
let n = 0;
folhas.forEach(({ arq, f, prefixo, raio }) => {
  const src = "data:image/png;base64," + readFileSync(arq).toString("base64");
  writeFileSync(tmp, `<body><img src="${src}"><pre id=o></pre><script>const RAIO = ${raio}, JUNTO = ${JUNTO[f] || 14};
    addEventListener("load", () => { document.getElementById("o").textContent = (${processar})(${MEDIR}); document.querySelector("img").remove(); });</script>`);
  const dom = execFileSync(CHROME, ["--headless", "--disable-gpu", "--virtual-time-budget=60000", "--dump-dom", pathToFileURL(tmp).href], { maxBuffer: 1 << 28 }).toString();
  const json = dom.match(/<pre id="o">([^<]*)</)[1].replace(/&quot;/g, '"');
  if (MEDIR) { console.log(f, json.slice(0, 400)); return; }
  JSON.parse(json).forEach((ic, k) => {
    const nome = `${prefixo}-${k + 1}`;
    writeFileSync(join(AQUI, "icones", nome + ".png"), Buffer.from(ic.icone.split(",")[1], "base64"));
    writeFileSync(join(AQUI, "icones", nome + "-sombra.png"), Buffer.from(ic.sombra.split(",")[1], "base64"));
    writeFileSync(join(AQUI, "icones", nome + "-recorte.png"), Buffer.from(ic.recorte.split(",")[1], "base64"));
    n++; console.log(nome, ic.w + "x" + ic.h, "<-", f);
  });
});
if (!MEDIR) console.log(n, "ícones");
